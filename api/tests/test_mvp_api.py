from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi.testclient import TestClient

from app.config import Settings
from app.db.repository import RecordStore
from app.db.reset import reset_database
from app.db.seed import seed_id
from app.main import create_app

if TYPE_CHECKING:
    from pathlib import Path

    from httpx import Response


def settings_for(tmp_path: Path) -> Settings:
    return Settings(
        app_name="Shifts MVP API",
        environment="test",
        host="127.0.0.1",
        port=9000,
        api_prefix="/api/v1",
        cors_allowed_origins=("http://localhost:5173",),
        database_path=tmp_path / "shifts.sqlite",
    )


def login(client: TestClient, email: str) -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['accessToken']}"}


def seed_client(tmp_path: Path) -> tuple[TestClient, Settings]:
    config = settings_for(tmp_path)
    reset_database(config.database_path)
    client = TestClient(create_app(config))
    return client, config


def first_id(response: Response) -> str:
    return response.json()["data"][0]["id"]


def test_seed_reset_is_deterministic_and_auth_exposes_current_user(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        admin_headers = login(client, "admin@shifts.test")
        me = client.get("/api/v1/auth/me", headers=admin_headers)

    assert me.status_code == 200
    assert me.json()["email"] == "admin@shifts.test"

    first_users = RecordStore(config.database_path).list_public("users")
    reset_database(config.database_path)
    second_users = RecordStore(config.database_path).list_public("users")

    assert [user["id"] for user in first_users] == [user["id"] for user in second_users]
    assert seed_id("user:admin") in [user["id"] for user in second_users]


def test_admin_resources_and_settings_round_trip(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        users = client.get("/api/v1/users", params={"role": "DOCTOR"})
        departments = client.get("/api/v1/departments/coordinator-summaries")
        settings = client.get("/api/v1/system-settings")
        created = client.post(
            "/api/v1/users",
            json={
                "email": "new.coordinator@shifts.test",
                "firstName": "Nina",
                "lastName": "Nowa",
                "roles": [{"role": "COORDINATOR", "scope": "GLOBAL"}],
            },
        )
        updated_settings = client.put(
            "/api/v1/system-settings",
            json={**settings.json(), "language": "en", "enableSMSNotifications": True},
        )

    assert users.status_code == 200
    assert users.json()["meta"]["total"] == 3
    assert departments.status_code == 200
    assert departments.json()["data"][0]["coordinatorEmail"] == "koordynator@shifts.test"
    assert created.status_code == 201
    assert created.json()["status"] == "INVITED"
    assert updated_settings.status_code == 200
    assert updated_settings.json()["language"] == "en"


def test_generation_publication_immutability_metrics_and_audit(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        schedules = client.get("/api/v1/schedules", params={"status": "DRAFT"})
        schedule_id = first_id(schedules)
        generation = client.post(f"/api/v1/schedules/{schedule_id}/generate", json={"algorithmVersion": "test-v1"})
        run = client.get(f"/api/v1/generation-runs/{generation.json()['id']}")
        validation = client.post(f"/api/v1/schedules/{schedule_id}/validate", json={})
        published = client.post(f"/api/v1/schedules/{schedule_id}/publish", json={"comment": "Ready"})
        immutable_update = client.patch(
            f"/api/v1/schedules/{schedule_id}",
            json={"availabilityDeadline": "2026-05-01T00:00:00Z"},
        )
        metrics = client.get(f"/api/v1/schedules/{schedule_id}/metrics")
        audit = client.get("/api/v1/audit-log", params={"entityType": "Schedule", "entityId": schedule_id})

    assert generation.status_code == 202
    assert generation.json()["status"] == "SUCCEEDED"
    assert run.status_code == 200
    assert validation.json()["isCompliant"] is True
    assert published.status_code == 200
    assert published.json()["status"] == "PUBLISHED"
    assert immutable_update.status_code == 409
    assert metrics.json()["summary"]["assignedShiftCount"] == 7
    assert any(entry["actionType"] == "SCHEDULE_PUBLISHED" for entry in audit.json()["data"])


def test_availability_deadline_and_leave_request_flow(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        doctor_headers = login(client, "lekarz1@shifts.test")
        coordinator_headers = login(client, "koordynator@shifts.test")
        schedule_id = first_id(client.get("/api/v1/schedules", params={"status": "DRAFT"}))
        availability = client.put(
            f"/api/v1/schedules/{schedule_id}/availability/me",
            headers=doctor_headers,
            json={"days": [{"date": "2026-05-01", "availabilityType": "UNAVAILABLE"}]},
        )
        collection = client.get(f"/api/v1/schedules/{schedule_id}/availability-collection-view")
        leave = client.post(
            f"/api/v1/schedules/{schedule_id}/leave-requests",
            headers=doctor_headers,
            json={"dateFrom": "2026-05-02", "dateTo": "2026-05-03", "typeLabel": "Urlop", "reason": "Family"},
        )
        approved = client.post(
            f"/api/v1/leave-requests/{leave.json()['id']}/approve",
            headers=coordinator_headers,
            json={"comment": "OK"},
        )
        schedule = client.get(f"/api/v1/schedules/{schedule_id}").json()
        client.patch(
            f"/api/v1/schedules/{schedule_id}",
            headers=coordinator_headers,
            json={"availabilityDeadline": "2026-04-01T00:00:00Z"},
        )
        blocked = client.put(
            f"/api/v1/schedules/{schedule_id}/availability/me",
            headers=doctor_headers,
            json={"days": [{"date": schedule["periodStart"], "availabilityType": "AVAILABLE"}]},
        )

    assert availability.status_code == 200
    assert availability.json()["status"] == "SUBMITTED"
    assert collection.status_code == 200
    assert approved.status_code == 200
    assert approved.json()["status"] == "APPROVED"
    assert blocked.status_code == 409


def test_published_swap_approval_updates_assignments(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        doctor1_headers = login(client, "lekarz1@shifts.test")
        doctor3_headers = login(client, "lekarz3@shifts.test")
        coordinator_headers = login(client, "koordynator@shifts.test")
        schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        assignments = client.get(f"/api/v1/schedules/{schedule_id}/assignments").json()["data"]
        shifts = {item["id"]: item for item in client.get(f"/api/v1/schedules/{schedule_id}/shifts").json()["data"]}
        doctor1_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor1_headers).json()["doctorProfileId"]
        doctor3_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor3_headers).json()["doctorProfileId"]
        source_assignment = next(
            item
            for item in assignments
            if item["doctorProfileId"] == doctor1_id and shifts[item["shiftId"]]["date"] == "2026-04-01"
        )
        created = client.post(
            f"/api/v1/schedules/{schedule_id}/swap-requests",
            headers=doctor1_headers,
            json={"sourceAssignmentId": source_assignment["id"], "candidates": [{"doctorProfileId": doctor3_id}]},
        )
        swap_id = created.json()["id"]
        response = client.post(
            f"/api/v1/swap-requests/{swap_id}/respond", headers=doctor3_headers, json={"decision": "ACCEPT"}
        )
        validation = client.post(f"/api/v1/swap-requests/{swap_id}/validate", headers=coordinator_headers)
        approved = client.post(
            f"/api/v1/swap-requests/{swap_id}/approve",
            headers=coordinator_headers,
            json={"comment": "Approved"},
        )
        approval_view = client.get(f"/api/v1/schedules/{schedule_id}/swap-approval-view", headers=coordinator_headers)

    assert created.status_code == 201
    assert response.json()["status"] == "PENDING_COORDINATOR_APPROVAL"
    assert validation.json()["isCompliant"] is True
    assert approved.status_code == 200
    assert approved.json()["status"] == "APPROVED"
    assert approval_view.json()["data"][0]["status"] == "Approved"


def test_calendar_export_and_notifications(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        doctor_headers = login(client, "lekarz1@shifts.test")
        schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        created = client.post("/api/v1/calendar-exports", headers=doctor_headers, json={"scheduleId": schedule_id})
        exports = client.get("/api/v1/calendar-exports", headers=doctor_headers)
        token = created.json()["icsUrl"].split("/")[-1].removesuffix(".ics")
        ics = client.get(f"/api/v1/calendar-exports/{token}.ics")
        notifications = client.get("/api/v1/notifications", headers=doctor_headers)

    assert created.status_code == 201
    assert exports.json()["data"][0]["enabled"] is True
    assert "BEGIN:VCALENDAR" in ics.text
    assert notifications.status_code == 200
