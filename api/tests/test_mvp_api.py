from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.config import Settings
from app.db.repository import RecordStore
from app.db.reset import reset_database
from app.db.seed import ensure_seeded, seed_id
from app.db.session import database_connection, decode_record
from app.main import create_app
from app.services.mvp import MvpService, ends_at, starts_at

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


def test_auth_error_refresh_reset_and_current_user_variants(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        invalid_login = client.post("/api/v1/auth/login", json={"email": "nobody@shifts.test", "password": "wrong"})
        admin_headers = login(client, "admin@shifts.test")
        refreshed = client.post(
            "/api/v1/auth/refresh",
            json={"refreshToken": admin_headers["Authorization"].replace("Bearer seed-token:", "refresh-token:")},
        )
        reset = client.post("/api/v1/auth/password-reset-requests", json={"email": "missing@shifts.test"})
        anonymous_me = client.get("/api/v1/auth/me")
        malformed_auth_me = client.get("/api/v1/auth/me", headers={"Authorization": "Basic abc"})
        missing_token_me = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer seed-token:missing"})
        admin_doctor_context = client.get("/api/v1/doctor-profiles/me/context", headers=admin_headers)

    assert invalid_login.status_code == 401
    assert refreshed.status_code == 200
    assert reset.status_code == 202
    assert anonymous_me.json()["email"] == "admin@shifts.test"
    assert malformed_auth_me.json()["email"] == "admin@shifts.test"
    assert missing_token_me.status_code == 404
    assert admin_doctor_context.status_code == 404


def test_admin_crud_filters_and_configuration_variants(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        admin_headers = login(client, "admin@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        coordinator_id = first_id(client.get("/api/v1/users", params={"role": "COORDINATOR"}))
        inactive_department = client.post(
            "/api/v1/departments",
            headers=admin_headers,
            json={"name": "SOR", "hospitalName": "Szpital Miejski", "timezone": "Europe/Warsaw"},
        ).json()
        patched_department = client.patch(
            f"/api/v1/departments/{inactive_department['id']}",
            headers=admin_headers,
            json={"active": False, "name": "SOR nocny"},
        )
        active_departments = client.get("/api/v1/departments", params={"active": True})
        inactive_departments = client.get("/api/v1/departments", params={"active": False})
        assignment = client.put(
            f"/api/v1/departments/{department_id}/coordinator",
            headers=admin_headers,
            json={"coordinatorUserId": coordinator_id, "validFrom": "2026-04-15"},
        )
        user_id = first_id(client.get("/api/v1/users", params={"status": "ACTIVE"}))
        user = client.get(f"/api/v1/users/{user_id}")
        patched_user = client.patch(f"/api/v1/users/{user_id}", headers=admin_headers, json={"lastName": "Changed"})
        roles = client.put(
            f"/api/v1/users/{user_id}/roles",
            headers=admin_headers,
            json={"roles": [{"role": "ADMIN", "scope": "GLOBAL"}]},
        )
        doctor_id = first_id(client.get("/api/v1/doctor-profiles", params={"active": True}))
        doctor = client.get(f"/api/v1/doctor-profiles/{doctor_id}")
        doctor_patched = client.patch(
            f"/api/v1/doctor-profiles/{doctor_id}",
            headers=admin_headers,
            json={"weeklyHourLimitMinutes": 3000, "active": False},
        )
        inactive_doctors = client.get("/api/v1/doctor-profiles", params={"active": False})
        profile_without_department = client.post(
            "/api/v1/doctor-profiles",
            headers=admin_headers,
            json={
                "userId": seed_id("user:coordinator"),
                "licenseNumber": "PWZ-X",
                "employmentType": "OTHER",
                "weeklyHourLimitMinutes": 1200,
            },
        )
        preference = client.post(
            "/api/v1/preference-categories",
            headers=admin_headers,
            json={"code": "I", "name": "Extra", "priority": 9},
        )
        hard_rules = client.get("/api/v1/constraint-rules", params={"type": "HARD", "active": True})
        all_rules = client.get("/api/v1/constraint-rules")
        missing_user = client.get("/api/v1/users/00000000-0000-0000-0000-000000000000")

    assert patched_department.json()["active"] is False
    assert active_departments.json()["meta"]["total"] >= 1
    assert inactive_departments.json()["meta"]["total"] == 1
    assert assignment.json()["active"] is True
    assert user.status_code == 200
    assert patched_user.json()["lastName"] == "Changed"
    assert roles.json()["roles"][0]["role"] == "ADMIN"
    assert doctor.status_code == 200
    assert doctor_patched.json()["weeklyHourLimitMinutes"] == 3000
    assert inactive_doctors.json()["meta"]["total"] >= 1
    assert profile_without_department.status_code == 201
    assert preference.status_code == 201
    assert hard_rules.json()["data"]
    assert all_rules.json()["data"]
    assert missing_user.status_code == 404


def test_invitation_acceptance_and_filters(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        coordinator_headers = login(client, "koordynator@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        created = client.post(
            "/api/v1/doctor-invitations",
            headers=coordinator_headers,
            json={"departmentId": department_id, "scheduleId": schedule_id, "email": "invitee@shifts.test"},
        )
        invitation_id = created.json()["id"]
        by_department = client.get("/api/v1/doctor-invitations", params={"department_id": department_id})
        by_status = client.get("/api/v1/doctor-invitations", params={"status": "PENDING"})
        resent = client.post(f"/api/v1/doctor-invitations/{invitation_id}/resend", headers=coordinator_headers)
        accepted = client.post(
            "/api/v1/doctor-invitations/accept",
            json={
                "token": "invite-token:invitee@shifts.test",
                "firstName": "Iga",
                "lastName": "Invitee",
                "email": "invitee@shifts.test",
                "password": "password123",
            },
        )
        accepted_without_invitation = client.post(
            "/api/v1/doctor-invitations/accept",
            json={
                "token": "unknown-token",
                "firstName": "No",
                "lastName": "Invite",
                "email": "no-invite@shifts.test",
                "password": "password123",
            },
        )

    assert created.status_code == 201
    assert by_department.json()["meta"]["total"] == 1
    assert by_status.json()["meta"]["total"] == 1
    assert resent.json()["id"] == invitation_id
    assert accepted.status_code == 201
    assert accepted.json()["user"]["email"] == "invitee@shifts.test"
    assert accepted_without_invitation.status_code == 201


def test_schedule_routes_filters_views_and_mutations(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        coordinator_headers = login(client, "koordynator@shifts.test")
        doctor_headers = login(client, "lekarz2@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        doctors = client.get("/api/v1/doctor-profiles").json()["data"]
        doctor_ids = [doctor["id"] for doctor in doctors]
        created_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-06-01",
                "periodEnd": "2026-06-02",
                "availabilityDeadline": "2026-05-30T20:00:00Z",
                "participantDoctorProfileIds": doctor_ids[:2],
            },
        )
        schedule_id = created_schedule.json()["id"]
        all_filtered = client.get(
            "/api/v1/schedules",
            params={
                "departmentId": department_id,
                "status": "DRAFT",
                "periodFrom": "2026-06-01",
                "periodTo": "2026-06-30",
            },
        )
        current_for_department = client.get("/api/v1/schedules/current", params={"departmentId": department_id})
        missing_current = client.get(
            "/api/v1/schedules/current", params={"departmentId": "00000000-0000-0000-0000-000000000000"}
        )
        participants_before = client.get(f"/api/v1/schedules/{schedule_id}/participants")
        added_existing = client.post(
            f"/api/v1/schedules/{schedule_id}/participants",
            headers=coordinator_headers,
            json={"doctorProfileId": doctor_ids[0]},
        )
        added_new = client.post(
            f"/api/v1/schedules/{schedule_id}/participants",
            headers=coordinator_headers,
            json={"doctorProfileId": doctor_ids[2]},
        )
        removed_new = client.delete(
            f"/api/v1/schedules/{schedule_id}/participants/{doctor_ids[2]}",
            headers=coordinator_headers,
        )
        shift = client.post(
            f"/api/v1/schedules/{schedule_id}/shifts",
            headers=coordinator_headers,
            json={"date": "2026-06-03"},
        )
        shift_id = shift.json()["id"]
        shifted = client.patch(
            f"/api/v1/schedules/{schedule_id}/shifts/{shift_id}",
            headers=coordinator_headers,
            json={"status": "CONFLICTED"},
        )
        shifts = client.get(f"/api/v1/schedules/{schedule_id}/shifts").json()["data"]
        assignment = client.post(
            f"/api/v1/schedules/{schedule_id}/assignments",
            headers=coordinator_headers,
            json={"shiftId": shifts[0]["id"], "doctorProfileId": doctor_ids[0]},
        )
        assignment_id = assignment.json()["id"]
        assignment_filtered = client.get(
            f"/api/v1/schedules/{schedule_id}/assignments",
            params={"doctorProfileId": doctor_ids[0], "status": "CONFIRMED"},
        )
        updated_assignment = client.patch(
            f"/api/v1/schedules/{schedule_id}/assignments/{assignment_id}",
            headers=coordinator_headers,
            json={"status": "PROPOSED"},
        )
        remove_with_assignment = client.delete(
            f"/api/v1/schedules/{schedule_id}/participants/{doctor_ids[0]}",
            headers=coordinator_headers,
        )
        cancelled = client.delete(
            f"/api/v1/schedules/{schedule_id}/assignments/{assignment_id}",
            headers=coordinator_headers,
        )
        my_empty_availability = client.get(f"/api/v1/schedules/{schedule_id}/availability/me", headers=doctor_headers)
        doctor_availability_missing = client.get(
            f"/api/v1/schedules/{schedule_id}/availability/{doctor_ids[0]}", headers=coordinator_headers
        )
        editor = client.get(f"/api/v1/schedules/{schedule_id}/editor-view", headers=coordinator_headers)
        coordinator_dashboard = client.get(
            f"/api/v1/schedules/{schedule_id}/coordinator-dashboard", headers=coordinator_headers
        )
        doctor_dashboard = client.get(f"/api/v1/schedules/{schedule_id}/doctor-dashboard", headers=doctor_headers)
        doctor_schedule = client.get(f"/api/v1/schedules/{schedule_id}/doctor-schedule", headers=doctor_headers)

    assert created_schedule.status_code == 201
    assert all_filtered.json()["meta"]["total"] == 1
    assert current_for_department.status_code == 200
    assert missing_current.status_code == 404
    assert participants_before.json()["data"]
    assert added_existing.status_code == 201
    assert added_new.status_code == 201
    assert removed_new.status_code == 204
    assert shifted.json()["status"] == "CONFLICTED"
    assert assignment.status_code == 201
    assert assignment_filtered.json()["data"]
    assert updated_assignment.json()["status"] == "PROPOSED"
    assert remove_with_assignment.status_code == 409
    assert cancelled.status_code == 204
    assert my_empty_availability.json()["status"] == "DRAFT"
    assert doctor_availability_missing.status_code == 404
    assert editor.json()["conflicts"]
    assert coordinator_dashboard.status_code == 200
    assert doctor_dashboard.json()["canRequestSwap"] is False
    assert doctor_schedule.json()["shifts"] == []


def test_hard_rule_validation_publication_conflict_generation_and_archive(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        coordinator_headers = login(client, "koordynator@shifts.test")
        doctor_headers = login(client, "lekarz1@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        doctor_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor_headers).json()["doctorProfileId"]
        created_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-07-01",
                "periodEnd": "2026-07-03",
                "availabilityDeadline": "2026-06-30T20:00:00Z",
                "participantDoctorProfileIds": [doctor_id],
            },
        )
        schedule_id = created_schedule.json()["id"]
        shifts = client.get(f"/api/v1/schedules/{schedule_id}/shifts").json()["data"]
        unavailable_shift = next(item for item in shifts if item["date"] == "2026-07-01")
        unavailable = client.put(
            f"/api/v1/schedules/{schedule_id}/availability/me",
            headers=doctor_headers,
            json={"days": [{"date": "2026-07-01", "availabilityType": "UNAVAILABLE"}]},
        )
        invalid_assignment = client.post(
            f"/api/v1/schedules/{schedule_id}/assignments",
            headers=coordinator_headers,
            json={"shiftId": unavailable_shift["id"], "doctorProfileId": doctor_id},
        )
        proposed_validation = client.post(
            f"/api/v1/schedules/{schedule_id}/validate",
            headers=coordinator_headers,
            json={"proposedAssignment": {"shiftId": unavailable_shift["id"], "doctorProfileId": doctor_id}},
        )
        invalid_publish = client.post(f"/api/v1/schedules/{schedule_id}/publish", headers=coordinator_headers, json={})
        dry_run = client.post(
            f"/api/v1/schedules/{schedule_id}/generate",
            headers=coordinator_headers,
            json={"dryRun": True},
        )
        generation = client.post(f"/api/v1/schedules/{schedule_id}/generate", headers=coordinator_headers, json={})
        conflict_report = client.get(
            f"/api/v1/generation-runs/{generation.json()['id']}/conflict-report", headers=coordinator_headers
        )
        missing_conflict_report = client.get(
            "/api/v1/generation-runs/00000000-0000-0000-0000-000000000000/conflict-report",
            headers=coordinator_headers,
        )
        published_schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        invalid_generate = client.post(
            f"/api/v1/schedules/{published_schedule_id}/generate", headers=coordinator_headers, json={}
        )
        archived = client.post(
            f"/api/v1/schedules/{published_schedule_id}/archive",
            headers=coordinator_headers,
            json={"reason": "Closed"},
        )
        archived_metrics = client.get(f"/api/v1/schedules/{published_schedule_id}/metrics", headers=coordinator_headers)

    assert unavailable.status_code == 200
    assert invalid_assignment.status_code == 422
    assert proposed_validation.json()["isCompliant"] is False
    assert invalid_publish.status_code == 422
    assert dry_run.json()["createdAssignmentCount"] == 0
    assert generation.json()["status"] == "FAILED"
    assert conflict_report.status_code == 200
    assert missing_conflict_report.status_code == 404
    assert invalid_generate.status_code == 409
    assert archived.json()["status"] == "ARCHIVED"
    assert archived_metrics.json()["summary"]["assignedShiftCount"] >= 1

    service = MvpService(config.database_path)
    assert starts_at(date(2026, 8, 1)).startswith("2026-08-01")
    assert ends_at(date(2026, 8, 1)).startswith("2026-08-02")
    assert (
        service.is_doctor_available(
            schedule_id, doctor_id, next(item for item in shifts if item["date"] == "2026-07-02")
        )
        is True
    )


def test_leave_reject_cancel_and_filtered_lists(tmp_path: Path) -> None:
    client, _ = seed_client(tmp_path)

    with client:
        doctor_headers = login(client, "lekarz2@shifts.test")
        coordinator_headers = login(client, "koordynator@shifts.test")
        schedule_id = first_id(client.get("/api/v1/schedules", params={"status": "DRAFT"}))
        doctor_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor_headers).json()["doctorProfileId"]
        leave = client.post(
            f"/api/v1/schedules/{schedule_id}/leave-requests",
            headers=doctor_headers,
            json={"dateFrom": "2026-05-05", "dateTo": "2026-05-05", "typeLabel": "Szkolenie"},
        )
        leave_id = leave.json()["id"]
        listed = client.get(
            f"/api/v1/schedules/{schedule_id}/leave-requests",
            params={"doctorProfileId": doctor_id, "status": "SUBMITTED"},
        )
        rejected = client.post(
            f"/api/v1/leave-requests/{leave_id}/reject",
            headers=coordinator_headers,
            json={"comment": "No coverage"},
        )
        cancelled = client.post(f"/api/v1/leave-requests/{leave_id}/cancel", headers=doctor_headers)
        empty = client.get(
            f"/api/v1/schedules/{schedule_id}/leave-requests",
            params={"doctorProfileId": doctor_id, "status": "SUBMITTED"},
        )

    assert listed.json()["data"][0]["request"]["id"] == leave_id
    assert rejected.json()["status"] == "REJECTED"
    assert rejected.json()["rejectionReason"] == "No coverage"
    assert cancelled.json()["status"] == "CANCELLED"
    assert empty.json()["data"] == []


def test_swap_error_reject_target_and_filter_variants(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        doctor1_headers = login(client, "lekarz1@shifts.test")
        doctor2_headers = login(client, "lekarz2@shifts.test")
        doctor3_headers = login(client, "lekarz3@shifts.test")
        coordinator_headers = login(client, "koordynator@shifts.test")
        draft_id = first_id(client.get("/api/v1/schedules", params={"status": "DRAFT"}))
        published_id = client.get("/api/v1/schedules/current").json()["id"]
        assignments = client.get(f"/api/v1/schedules/{published_id}/assignments").json()["data"]
        doctor1_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor1_headers).json()["doctorProfileId"]
        doctor2_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor2_headers).json()["doctorProfileId"]
        doctor3_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor3_headers).json()["doctorProfileId"]
        doctor1_assignment = next(item for item in assignments if item["doctorProfileId"] == doctor1_id)
        doctor2_assignment = next(item for item in assignments if item["doctorProfileId"] == doctor2_id)
        draft_swap = client.post(
            f"/api/v1/schedules/{draft_id}/swap-requests",
            headers=doctor1_headers,
            json={"sourceAssignmentId": doctor1_assignment["id"], "candidates": [{"doctorProfileId": doctor2_id}]},
        )
        not_owned = client.post(
            f"/api/v1/schedules/{published_id}/swap-requests",
            headers=doctor2_headers,
            json={"sourceAssignmentId": doctor1_assignment["id"], "candidates": [{"doctorProfileId": doctor3_id}]},
        )
        pending = client.post(
            f"/api/v1/schedules/{published_id}/swap-requests",
            headers=doctor1_headers,
            json={"sourceAssignmentId": doctor1_assignment["id"], "candidates": [{"doctorProfileId": doctor2_id}]},
        )
        pending_id = pending.json()["id"]
        invalid_validation = client.post(f"/api/v1/swap-requests/{pending_id}/validate", headers=coordinator_headers)
        invalid_approval = client.post(
            f"/api/v1/swap-requests/{pending_id}/approve", headers=coordinator_headers, json={}
        )
        rejected_by_doctor = client.post(
            f"/api/v1/swap-requests/{pending_id}/respond", headers=doctor2_headers, json={"decision": "REJECT"}
        )
        rejected_by_coordinator = client.post(
            f"/api/v1/swap-requests/{pending_id}/reject",
            headers=coordinator_headers,
            json={"comment": "No"},
        )
        filtered_by_status = client.get(
            f"/api/v1/schedules/{published_id}/swap-requests",
            params={"status": "REJECTED_BY_COORDINATOR"},
        )
        filtered_by_doctor = client.get(
            f"/api/v1/schedules/{published_id}/swap-requests",
            params={"doctorProfileId": doctor2_id},
        )
        swap_options = client.get(f"/api/v1/schedules/{draft_id}/swap-options", headers=doctor1_headers)
        target_swap = client.post(
            f"/api/v1/schedules/{published_id}/swap-requests",
            headers=doctor1_headers,
            json={
                "sourceAssignmentId": doctor1_assignment["id"],
                "targetAssignmentId": doctor2_assignment["id"],
                "candidates": [{"doctorProfileId": doctor2_id, "assignmentId": doctor2_assignment["id"]}],
            },
        )
        doctor_approval = client.get(
            f"/api/v1/swap-requests/{target_swap.json()['id']}/doctor-approval-view", headers=doctor2_headers
        )

    assert draft_swap.status_code == 409
    assert not_owned.status_code == 409
    assert invalid_validation.json()["isCompliant"] is False
    assert invalid_approval.status_code == 422
    assert rejected_by_doctor.json()["status"] == "REJECTED_BY_DOCTOR"
    assert rejected_by_coordinator.json()["status"] == "REJECTED_BY_COORDINATOR"
    assert filtered_by_status.json()["data"]
    assert filtered_by_doctor.json()["data"]
    assert swap_options.json()["enabled"] is False
    assert doctor_approval.status_code == 200

    service = MvpService(config.database_path)
    target_result = service.validate_swap(target_swap.json()["id"])
    assert target_result["targetType"] == "SWAP_REQUEST"


def test_notifications_calendar_revoke_audit_filters_and_storage_errors(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        doctor_headers = login(client, "lekarz1@shifts.test")
        schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        export = client.post("/api/v1/calendar-exports", headers=doctor_headers, json={"scheduleId": schedule_id})
        export_id = export.json()["id"]
        token = export.json()["icsUrl"].split("/")[-1].removesuffix(".ics")
        revoked = client.delete(f"/api/v1/calendar-exports/{export_id}", headers=doctor_headers)
        missing_ics = client.get(f"/api/v1/calendar-exports/{token}.ics")
        notification = {
            "id": "00000000-0000-0000-0000-000000000123",
            "recipientUserId": seed_id("user:doctor:1"),
            "channel": "EMAIL",
            "type": "TEST",
            "title": "T",
            "body": "B",
            "status": "SENT",
        }
        RecordStore(config.database_path).save("notifications", notification)
        sent_notifications = client.get("/api/v1/notifications", headers=doctor_headers, params={"status": "SENT"})
        read_notification = client.post(f"/api/v1/notifications/{notification['id']}/read", headers=doctor_headers)
        audit_by_actor = client.get("/api/v1/audit-log", params={"actorUserId": seed_id("user:admin")})
        audit_filtered_empty = client.get(
            "/api/v1/audit-log",
            params={
                "entityType": "Nothing",
                "entityId": "00000000-0000-0000-0000-000000000000",
                "actorUserId": "00000000-0000-0000-0000-000000000000",
            },
        )

    assert revoked.status_code == 204
    assert missing_ics.status_code == 404
    assert sent_notifications.json()["data"][0]["id"] == notification["id"]
    assert read_notification.json()["status"] == "READ"
    assert audit_by_actor.json()["data"]
    assert audit_filtered_empty.json()["data"] == []

    with database_connection(config.database_path) as connection:
        connection.execute(
            "INSERT OR REPLACE INTO records(kind, id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            ("broken", "bad", "[]", "2026-01-01T00:00:00Z", "2026-01-01T00:00:00Z"),
        )
    with pytest.raises(TypeError, match="JSON object"):
        RecordStore(config.database_path).get("broken", "bad")

    with pytest.raises(TypeError, match="JSON object"):
        decode_record("[]")


def test_remaining_read_endpoints_and_http_error_variants(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    async def plain_error() -> None:
        raise HTTPException(status_code=418, detail="plain detail")

    def force_rollback() -> None:
        with database_connection(config.database_path) as connection:
            connection.execute(
                "INSERT OR REPLACE INTO records(kind, id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ("rollback", "one", "{}", "2026-01-01T00:00:00Z", "2026-01-01T00:00:00Z"),
            )
            raise RuntimeError("force rollback")

    client.app.add_api_route("/plain-error", plain_error)

    with client:
        admin_headers = login(client, "admin@shifts.test")
        coordinator_headers = login(client, "koordynator@shifts.test")
        doctor_headers = login(client, "lekarz1@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        doctor_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor_headers).json()["doctorProfileId"]
        department = client.get(f"/api/v1/departments/{department_id}")
        doctors_by_department = client.get("/api/v1/doctor-profiles", params={"department_id": department_id})
        preferences = client.get("/api/v1/preference-categories")
        schedules_status_only = client.get("/api/v1/schedules", params={"status": "DRAFT"})
        schedules_period_only = client.get("/api/v1/schedules", params={"periodFrom": "2026-01-01"})
        schedule_id = first_id(schedules_status_only)
        submitted_availability = client.put(
            f"/api/v1/schedules/{schedule_id}/availability/me",
            headers=doctor_headers,
            json={"days": [{"date": "2026-05-01", "availabilityType": "AVAILABLE"}]},
        )
        all_availability = client.get(f"/api/v1/schedules/{schedule_id}/availability")
        my_submitted_availability = client.get(
            f"/api/v1/schedules/{schedule_id}/availability/me", headers=doctor_headers
        )
        doctor_availability = client.get(f"/api/v1/schedules/{schedule_id}/availability/{doctor_id}")
        published_schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        publish_already_published = client.post(
            f"/api/v1/schedules/{published_schedule_id}/publish", headers=coordinator_headers, json={}
        )
        doctor_dashboard = client.get(
            f"/api/v1/schedules/{published_schedule_id}/doctor-dashboard", headers=doctor_headers
        )
        doctor_schedule = client.get(
            f"/api/v1/schedules/{published_schedule_id}/doctor-schedule", headers=doctor_headers
        )
        swap_options = client.get(f"/api/v1/schedules/{published_schedule_id}/swap-options", headers=doctor_headers)
        assignments = client.get(f"/api/v1/schedules/{published_schedule_id}/assignments").json()["data"]
        source_assignment = next(item for item in assignments if item["doctorProfileId"] == doctor_id)
        other_doctor_id = client.get(
            "/api/v1/doctor-profiles/me/context", headers=login(client, "lekarz2@shifts.test")
        ).json()["doctorProfileId"]
        swap = client.post(
            f"/api/v1/schedules/{published_schedule_id}/swap-requests",
            headers=doctor_headers,
            json={"sourceAssignmentId": source_assignment["id"], "candidates": [{"doctorProfileId": other_doctor_id}]},
        )
        swap_request = client.get(f"/api/v1/swap-requests/{swap.json()['id']}")
        invalid_prefix_me = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer not-a-seed-token"})
        plain = client.get("/plain-error")
        new_department = client.post(
            "/api/v1/departments",
            headers=admin_headers,
            json={"name": "No coordinator", "hospitalName": "Szpital", "timezone": "Europe/Warsaw"},
        ).json()
        new_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": new_department["id"],
                "periodStart": "2026-08-01",
                "periodEnd": "2026-08-01",
                "availabilityDeadline": "2026-07-31T20:00:00Z",
                "participantDoctorProfileIds": [],
            },
        )
        assigned_new_department = client.put(
            f"/api/v1/departments/{new_department['id']}/coordinator",
            headers=admin_headers,
            json={"coordinatorUserId": seed_id("user:coordinator"), "validFrom": "2026-08-01"},
        )
        removed_missing_participant = client.delete(
            f"/api/v1/schedules/{new_schedule.json()['id']}/participants/{doctor_id}",
            headers=coordinator_headers,
        )

    assert department.json()["id"] == department_id
    assert doctors_by_department.json()["meta"]["total"] >= 1
    assert preferences.json()["data"]
    assert schedules_status_only.json()["meta"]["total"] >= 1
    assert schedules_period_only.json()["meta"]["total"] >= schedules_status_only.json()["meta"]["total"]
    assert submitted_availability.status_code == 200
    assert all_availability.json()["data"][0]["doctorProfileId"] == doctor_id
    assert my_submitted_availability.json()["status"] == "SUBMITTED"
    assert doctor_availability.json()["doctorProfileId"] == doctor_id
    assert publish_already_published.status_code == 409
    assert doctor_dashboard.json()["canRequestSwap"] is True
    assert doctor_schedule.json()["shifts"]
    assert swap_options.json()["enabled"] is True
    assert swap_options.json()["myShifts"]
    assert swap_request.json()["id"] == swap.json()["id"]
    assert invalid_prefix_me.json()["email"] == "admin@shifts.test"
    assert plain.status_code == 418
    assert plain.json()["code"] == "HTTP_ERROR"
    assert new_schedule.json()["coordinatorUserId"] == seed_id("user:coordinator")
    assert assigned_new_department.json()["departmentId"] == new_department["id"]
    assert removed_missing_participant.status_code == 204

    empty_database_path = tmp_path / "empty.sqlite"
    ensure_seeded(empty_database_path)
    assert RecordStore(empty_database_path).list_public("users")

    with pytest.raises(RuntimeError, match="force rollback"):
        force_rollback()
    assert RecordStore(config.database_path).get("rollback", "one") is None


def test_domain_edge_cases_for_assignment_generation_leave_and_swaps(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        coordinator_headers = login(client, "koordynator@shifts.test")
        doctor1_headers = login(client, "lekarz1@shifts.test")
        doctor2_headers = login(client, "lekarz2@shifts.test")
        doctor3_headers = login(client, "lekarz3@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        doctor1_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor1_headers).json()["doctorProfileId"]
        doctor2_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor2_headers).json()["doctorProfileId"]
        doctor3_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor3_headers).json()["doctorProfileId"]

        one_day_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-09-01",
                "periodEnd": "2026-09-01",
                "availabilityDeadline": "2026-08-31T20:00:00Z",
                "participantDoctorProfileIds": [doctor1_id, doctor2_id],
            },
        ).json()
        one_day_shift = client.get(f"/api/v1/schedules/{one_day_schedule['id']}/shifts").json()["data"][0]
        first_assignment = client.post(
            f"/api/v1/schedules/{one_day_schedule['id']}/assignments",
            headers=coordinator_headers,
            json={"shiftId": one_day_shift["id"], "doctorProfileId": doctor1_id},
        )
        replacement_assignment = client.post(
            f"/api/v1/schedules/{one_day_schedule['id']}/assignments",
            headers=coordinator_headers,
            json={"shiftId": one_day_shift["id"], "doctorProfileId": doctor2_id},
        )
        replaced = client.get(f"/api/v1/schedules/{one_day_schedule['id']}/assignments").json()["data"]
        assigned_editor = client.get(
            f"/api/v1/schedules/{one_day_schedule['id']}/editor-view", headers=coordinator_headers
        )

        update_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-09-10",
                "periodEnd": "2026-09-10",
                "availabilityDeadline": "2026-09-09T20:00:00Z",
                "participantDoctorProfileIds": [doctor1_id, doctor2_id],
            },
        ).json()
        update_shift = client.get(f"/api/v1/schedules/{update_schedule['id']}/shifts").json()["data"][0]
        update_assignment = client.post(
            f"/api/v1/schedules/{update_schedule['id']}/assignments",
            headers=coordinator_headers,
            json={"shiftId": update_shift["id"], "doctorProfileId": doctor1_id},
        ).json()
        client.put(
            f"/api/v1/schedules/{update_schedule['id']}/availability/me",
            headers=doctor2_headers,
            json={"days": [{"date": "2026-09-10", "availabilityType": "UNAVAILABLE"}]},
        )
        invalid_update = client.patch(
            f"/api/v1/schedules/{update_schedule['id']}/assignments/{update_assignment['id']}",
            headers=coordinator_headers,
            json={"doctorProfileId": doctor2_id},
        )

        rest_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-09-20",
                "periodEnd": "2026-09-21",
                "availabilityDeadline": "2026-09-19T20:00:00Z",
                "participantDoctorProfileIds": [doctor1_id],
            },
        ).json()
        rest_shifts = client.get(f"/api/v1/schedules/{rest_schedule['id']}/shifts").json()["data"]
        rest_first_shift = next(item for item in rest_shifts if item["date"] == "2026-09-20")
        rest_second_shift = next(item for item in rest_shifts if item["date"] == "2026-09-21")
        client.post(
            f"/api/v1/schedules/{rest_schedule['id']}/assignments",
            headers=coordinator_headers,
            json={"shiftId": rest_first_shift["id"], "doctorProfileId": doctor1_id},
        )
        rest_validation = client.post(
            f"/api/v1/schedules/{rest_schedule['id']}/validate",
            headers=coordinator_headers,
            json={"proposedAssignment": {"shiftId": rest_second_shift["id"], "doctorProfileId": doctor1_id}},
        )

        leave_schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-10-01",
                "periodEnd": "2026-10-03",
                "availabilityDeadline": "2026-09-30T20:00:00Z",
                "participantDoctorProfileIds": [doctor1_id, doctor2_id],
            },
        ).json()
        leave = client.post(
            f"/api/v1/schedules/{leave_schedule['id']}/leave-requests",
            headers=doctor1_headers,
            json={"dateFrom": "2026-10-02", "dateTo": "2026-10-02", "typeLabel": "Urlop"},
        ).json()
        client.post(f"/api/v1/leave-requests/{leave['id']}/approve", headers=coordinator_headers, json={})
        leave_shift = next(
            item
            for item in client.get(f"/api/v1/schedules/{leave_schedule['id']}/shifts").json()["data"]
            if item["date"] == "2026-10-02"
        )
        leave_validation = client.post(
            f"/api/v1/schedules/{leave_schedule['id']}/validate",
            headers=coordinator_headers,
            json={"proposedAssignment": {"shiftId": leave_shift["id"], "doctorProfileId": doctor1_id}},
        )
        filtered_different_doctor = client.get(
            f"/api/v1/schedules/{leave_schedule['id']}/leave-requests",
            params={"doctorProfileId": doctor2_id},
        )
        filtered_different_schedule = client.get(
            f"/api/v1/schedules/{rest_schedule['id']}/leave-requests",
            params={"status": "APPROVED"},
        )

        current_schedule_id = client.get("/api/v1/schedules/current").json()["id"]
        current_assignments = client.get(f"/api/v1/schedules/{current_schedule_id}/assignments").json()["data"]
        current_source_assignment = next(item for item in current_assignments if item["doctorProfileId"] == doctor1_id)
        partial_swap = client.post(
            f"/api/v1/schedules/{current_schedule_id}/swap-requests",
            headers=doctor1_headers,
            json={
                "sourceAssignmentId": current_source_assignment["id"],
                "candidates": [{"doctorProfileId": doctor2_id}, {"doctorProfileId": doctor3_id}],
            },
        )
        partial_swap_after_one_reject = client.post(
            f"/api/v1/swap-requests/{partial_swap.json()['id']}/respond",
            headers=doctor2_headers,
            json={"decision": "REJECT"},
        )
        swap_view_for_other_schedule = client.get(
            f"/api/v1/schedules/{rest_schedule['id']}/swap-approval-view", headers=coordinator_headers
        )

    assert first_assignment.status_code == 201
    assert replacement_assignment.status_code == 201
    assert any(item["id"] == first_assignment.json()["id"] and item["status"] == "REPLACED" for item in replaced)
    assert assigned_editor.json()["conflicts"] == []
    assert invalid_update.status_code == 422
    assert any("adjacent" in item["message"] for item in rest_validation.json()["violations"])
    assert any("approved leave" in item["message"] for item in leave_validation.json()["violations"])
    assert filtered_different_doctor.json()["data"] == []
    assert filtered_different_schedule.json()["data"] == []
    assert partial_swap_after_one_reject.json()["status"] == "PENDING_DOCTOR_ACCEPTANCE"
    assert swap_view_for_other_schedule.json()["data"] == []

    service = MvpService(config.database_path)
    actor = service.get("users", seed_id("user:coordinator"))
    assert service.has_approved_leave(rest_schedule["id"], doctor1_id, rest_first_shift) is False
    assert (
        service.has_approved_leave(
            leave_schedule["id"], doctor1_id, next(item for item in rest_shifts if item["date"] == "2026-09-20")
        )
        is False
    )
    manual_schedule = {
        "id": "manual-empty-generated-schedule",
        "departmentId": department_id,
        "coordinatorUserId": actor["id"],
        "periodStart": "2026-11-01",
        "periodEnd": "2026-10-31",
        "availabilityDeadline": "2026-10-30T20:00:00Z",
        "status": "GENERATED",
        "createdAt": "2026-10-01T00:00:00Z",
    }
    service.save("schedules", manual_schedule)
    dry_run_without_conflicts = service.generate_schedule(manual_schedule["id"], {"dryRun": True}, actor)
    assert dry_run_without_conflicts["status"] == "SUCCEEDED"
    service.save(
        "assignments",
        {
            "id": "manual-assignment-for-regeneration",
            "scheduleId": manual_schedule["id"],
            "shiftId": "manual-nonexistent-shift",
            "doctorProfileId": doctor1_id,
            "status": "CONFIRMED",
            "source": "MANUAL",
            "createdAt": "2026-10-01T00:00:00Z",
            "confirmedAt": "2026-10-01T00:00:00Z",
        },
    )
    service.save(
        "assignments",
        {
            "id": "swap-assignment-for-regeneration",
            "scheduleId": manual_schedule["id"],
            "shiftId": "manual-nonexistent-swap-shift",
            "doctorProfileId": doctor2_id,
            "status": "CONFIRMED",
            "source": "SWAP",
            "createdAt": "2026-10-01T00:00:00Z",
            "confirmedAt": "2026-10-01T00:00:00Z",
        },
    )
    regenerated = service.generate_schedule(manual_schedule["id"], {}, actor)
    assert regenerated["status"] == "SUCCEEDED"
    assert service.get("assignments", "manual-assignment-for-regeneration")["status"] == "REPLACED"
    assert service.get("assignments", "swap-assignment-for-regeneration")["status"] == "CONFIRMED"


def test_target_assignment_swap_approval_replaces_both_sides(tmp_path: Path) -> None:
    client, config = seed_client(tmp_path)

    with client:
        coordinator_headers = login(client, "koordynator@shifts.test")
        doctor1_headers = login(client, "lekarz1@shifts.test")
        doctor2_headers = login(client, "lekarz2@shifts.test")
        department_id = first_id(client.get("/api/v1/departments"))
        doctor1_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor1_headers).json()["doctorProfileId"]
        doctor2_id = client.get("/api/v1/doctor-profiles/me/context", headers=doctor2_headers).json()["doctorProfileId"]
        schedule = client.post(
            "/api/v1/schedules",
            headers=coordinator_headers,
            json={
                "departmentId": department_id,
                "periodStart": "2026-12-01",
                "periodEnd": "2026-12-05",
                "availabilityDeadline": "2026-11-30T20:00:00Z",
                "participantDoctorProfileIds": [doctor1_id, doctor2_id],
            },
        ).json()
        schedule_id = schedule["id"]
        shifts = client.get(f"/api/v1/schedules/{schedule_id}/shifts").json()["data"]
        source_shift = next(item for item in shifts if item["date"] == "2026-12-01")
        target_shift = next(item for item in shifts if item["date"] == "2026-12-05")
        source_assignment = client.post(
            f"/api/v1/schedules/{schedule_id}/assignments",
            headers=coordinator_headers,
            json={"shiftId": source_shift["id"], "doctorProfileId": doctor1_id},
        ).json()
        target_assignment = client.post(
            f"/api/v1/schedules/{schedule_id}/assignments",
            headers=coordinator_headers,
            json={"shiftId": target_shift["id"], "doctorProfileId": doctor2_id},
        ).json()

    service = MvpService(config.database_path)
    service.save("schedules", {**service.get("schedules", schedule_id), "status": "PUBLISHED"})

    with client:
        swap = client.post(
            f"/api/v1/schedules/{schedule_id}/swap-requests",
            headers=doctor1_headers,
            json={
                "sourceAssignmentId": source_assignment["id"],
                "targetAssignmentId": target_assignment["id"],
                "candidates": [{"doctorProfileId": doctor2_id, "assignmentId": target_assignment["id"]}],
            },
        )
        accepted = client.post(
            f"/api/v1/swap-requests/{swap.json()['id']}/respond",
            headers=doctor2_headers,
            json={"decision": "ACCEPT"},
        )
        validation = client.post(f"/api/v1/swap-requests/{swap.json()['id']}/validate", headers=coordinator_headers)
        approved = client.post(
            f"/api/v1/swap-requests/{swap.json()['id']}/approve",
            headers=coordinator_headers,
            json={"comment": "Targeted swap"},
        )
        approval_view = client.get(f"/api/v1/schedules/{schedule_id}/swap-approval-view", headers=coordinator_headers)

    assert swap.status_code == 201
    assert accepted.json()["status"] == "PENDING_COORDINATOR_APPROVAL"
    assert validation.json()["isCompliant"] is True
    assert approved.json()["status"] == "APPROVED"
    assert service.get("assignments", source_assignment["id"])["status"] == "REPLACED"
    assert service.get("assignments", target_assignment["id"])["status"] == "REPLACED"
    assert approval_view.json()["data"][0]["shiftB"] == "2026-12-05"
