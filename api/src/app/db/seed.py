from __future__ import annotations

from datetime import UTC, date, datetime, time, timedelta
from pathlib import Path
from typing import Any
from uuid import NAMESPACE_URL, uuid5

from app.db.repository import RecordStore
from app.db.session import connect, initialize_database

SEED_NAMESPACE = "https://shifts-mvp.local/seed/"
SEED_PASSWORD = "password123"


def seed_id(name: str) -> str:
    """Return a stable UUID for deterministic seed data."""
    return str(uuid5(NAMESPACE_URL, f"{SEED_NAMESPACE}{name}"))


def ts(value: str) -> str:
    return value


def day_ts(value: date, hour: int = 8) -> str:
    return datetime.combine(value, time(hour, 0), tzinfo=UTC).isoformat().replace("+00:00", "Z")


def day_end_ts(value: date) -> str:
    return datetime.combine(value + timedelta(days=1), time(8, 0), tzinfo=UTC).isoformat().replace("+00:00", "Z")


def make_role(role: str, scope: str = "GLOBAL", department_id: str | None = None) -> dict[str, Any]:
    result = {"role": role, "scope": scope, "assignedAt": ts("2026-04-01T08:00:00Z")}
    if department_id:
        result["departmentId"] = department_id
    return result


def build_seed_records() -> dict[str, list[dict[str, Any]]]:
    """Build the complete deterministic MVP fixture set."""
    department_id = seed_id("department:cardiology")
    admin_id = seed_id("user:admin")
    coordinator_id = seed_id("user:coordinator")
    doctor_user_ids = [seed_id(f"user:doctor:{index}") for index in range(1, 4)]
    doctor_ids = [seed_id(f"doctor:{index}") for index in range(1, 4)]
    qualification_id = seed_id("qualification:internal-medicine")
    draft_schedule_id = seed_id("schedule:draft-may")
    published_schedule_id = seed_id("schedule:published-april")
    preference_ids = [seed_id(f"preference:{code}") for code in ("I", "II", "III")]

    users = [
        {
            "id": admin_id,
            "email": "admin@shifts.test",
            "firstName": "Alicja",
            "lastName": "Admin",
            "status": "ACTIVE",
            "roles": [make_role("ADMIN")],
            "createdAt": ts("2026-04-01T08:00:00Z"),
        },
        {
            "id": coordinator_id,
            "email": "koordynator@shifts.test",
            "firstName": "Konrad",
            "lastName": "Koordynator",
            "status": "ACTIVE",
            "roles": [make_role("COORDINATOR", "DEPARTMENT", department_id)],
            "createdAt": ts("2026-04-01T08:05:00Z"),
        },
    ]
    for index, user_id in enumerate(doctor_user_ids, start=1):
        users.append(
            {
                "id": user_id,
                "email": f"lekarz{index}@shifts.test",
                "firstName": ["Dorota", "Marek", "Ewa"][index - 1],
                "lastName": ["Nowak", "Kowalski", "Zielinska"][index - 1],
                "status": "ACTIVE",
                "roles": [make_role("DOCTOR", "DEPARTMENT", department_id)],
                "createdAt": ts(f"2026-04-01T08:0{index + 5}:00Z"),
                "_password": SEED_PASSWORD,
            }
        )
    users[0]["_password"] = SEED_PASSWORD
    users[1]["_password"] = SEED_PASSWORD

    doctors = [
        {
            "id": doctor_id,
            "userId": user_id,
            "licenseNumber": f"PWZ-2026-00{index}",
            "employmentType": "EMPLOYMENT_CONTRACT",
            "optOutSigned": index == 2,
            "weeklyHourLimitMinutes": 2880,
            "active": True,
            "departmentId": department_id,
            "qualifications": [
                {
                    "id": seed_id(f"doctor-qualification:{index}"),
                    "doctorProfileId": doctor_id,
                    "qualificationId": qualification_id,
                    "validFrom": "2026-01-01",
                    "verificationStatus": "VALID",
                }
            ],
        }
        for index, (doctor_id, user_id) in enumerate(zip(doctor_ids, doctor_user_ids, strict=True), start=1)
    ]

    departments = [
        {
            "id": department_id,
            "name": "Kardiologia",
            "hospitalName": "Szpital Miejski",
            "timezone": "Europe/Warsaw",
            "active": True,
            "createdAt": ts("2026-04-01T08:00:00Z"),
        }
    ]
    coordinator_assignments = [
        {
            "id": seed_id("coordinator-assignment:cardiology"),
            "departmentId": department_id,
            "coordinatorUserId": coordinator_id,
            "validFrom": "2026-04-01",
            "active": True,
        }
    ]

    schedules = [
        {
            "id": draft_schedule_id,
            "departmentId": department_id,
            "coordinatorUserId": coordinator_id,
            "periodStart": "2026-05-01",
            "periodEnd": "2026-05-07",
            "availabilityDeadline": "2026-04-30T20:00:00Z",
            "status": "DRAFT",
            "createdAt": ts("2026-04-20T08:00:00Z"),
        },
        {
            "id": published_schedule_id,
            "departmentId": department_id,
            "coordinatorUserId": coordinator_id,
            "periodStart": "2026-04-01",
            "periodEnd": "2026-04-07",
            "availabilityDeadline": "2026-03-25T20:00:00Z",
            "status": "PUBLISHED",
            "publishedAt": ts("2026-03-28T09:00:00Z"),
            "createdAt": ts("2026-03-15T08:00:00Z"),
        },
    ]

    participants = []
    shifts = []
    assignments = []
    availability = []
    for schedule in schedules:
        start = date.fromisoformat(schedule["periodStart"])
        end = date.fromisoformat(schedule["periodEnd"])
        for doctor_id in doctor_ids:
            participants.append(
                {
                    "id": seed_id(f"participant:{schedule['id']}:{doctor_id}"),
                    "scheduleId": schedule["id"],
                    "doctorProfileId": doctor_id,
                    "status": "ACTIVE",
                    "addedAt": schedule["createdAt"],
                }
            )
            days = []
            current = start
            while current <= end:
                days.append(
                    {
                        "id": seed_id(f"availability-day:{schedule['id']}:{doctor_id}:{current.isoformat()}"),
                        "date": current.isoformat(),
                        "availabilityType": "AVAILABLE",
                    }
                )
                current += timedelta(days=1)
            availability.append(
                {
                    "id": seed_id(f"availability:{schedule['id']}:{doctor_id}"),
                    "scheduleId": schedule["id"],
                    "doctorProfileId": doctor_id,
                    "status": "SUBMITTED" if schedule["status"] == "PUBLISHED" else "DRAFT",
                    "submittedAt": schedule["createdAt"] if schedule["status"] == "PUBLISHED" else None,
                    "days": days,
                }
            )
        current = start
        index = 0
        while current <= end:
            shift_id = seed_id(f"shift:{schedule['id']}:{current.isoformat()}")
            shift = {
                "id": shift_id,
                "scheduleId": schedule["id"],
                "date": current.isoformat(),
                "startsAt": day_ts(current),
                "endsAt": day_end_ts(current),
                "requiredQualificationId": qualification_id,
                "status": "UNASSIGNED",
            }
            if schedule["status"] == "PUBLISHED":
                doctor_id = doctor_ids[index % len(doctor_ids)]
                assignment_id = seed_id(f"assignment:{schedule['id']}:{shift_id}")
                assignments.append(
                    {
                        "id": assignment_id,
                        "scheduleId": schedule["id"],
                        "shiftId": shift_id,
                        "doctorProfileId": doctor_id,
                        "status": "CONFIRMED",
                        "source": "GENERATED",
                        "createdAt": schedule["publishedAt"],
                        "confirmedAt": schedule["publishedAt"],
                    }
                )
                shift["status"] = "ASSIGNED"
            shifts.append(shift)
            index += 1
            current += timedelta(days=1)

    return {
        "users": users,
        "departments": departments,
        "coordinator_assignments": coordinator_assignments,
        "doctor_profiles": doctors,
        "qualifications": [
            {
                "id": qualification_id,
                "code": "INTERNAL_MEDICINE",
                "name": "Choroby wewnetrzne",
                "description": "Dyzurowa kwalifikacja MVP",
                "active": True,
            }
        ],
        "doctor_invitations": [],
        "preference_categories": [
            {
                "id": preference_ids[0],
                "code": "I",
                "name": "Dzien ustawowo wolny",
                "priority": 1,
                "description": "Najwyzszy priorytet preferencji",
                "active": True,
            },
            {
                "id": preference_ids[1],
                "code": "II",
                "name": "Weekend",
                "priority": 2,
                "description": "Dni weekendowe",
                "active": True,
            },
            {
                "id": preference_ids[2],
                "code": "III",
                "name": "Dzien powszedni",
                "priority": 3,
                "description": "Pozostale dni",
                "active": True,
            },
        ],
        "constraint_rules": [
            {
                "id": seed_id("constraint:min-rest"),
                "code": "MIN_REST_11H",
                "name": "Minimum 11h odpoczynku",
                "type": "HARD",
                "severity": "BLOCKING",
                "active": True,
                "description": "Lekarz nie moze miec dwoch dyzurow dzien po dniu w MVP.",
            },
            {
                "id": seed_id("constraint:availability"),
                "code": "AVAILABILITY_REQUIRED",
                "name": "Dostepnosc lekarza",
                "type": "HARD",
                "severity": "BLOCKING",
                "active": True,
                "description": "Dyzurow nie przydziela sie w dniach niedostepnosci.",
            },
        ],
        "system_settings": [
            {
                "id": "global",
                "language": "pl",
                "timezone": "Europe/Warsaw",
                "minRestHours": 11,
                "maxWeeklyHours": 48,
                "maxMonthlyHours": 192,
                "enableEmailNotifications": True,
                "enableSMSNotifications": False,
                "defaultScheduleStatus": "DRAFT",
                "autoArchiveAfterDays": 90,
            }
        ],
        "schedules": schedules,
        "schedule_participants": participants,
        "shifts": shifts,
        "assignments": assignments,
        "availability": availability,
        "leave_requests": [],
        "generation_runs": [],
        "conflict_reports": [],
        "swap_requests": [],
        "notifications": [],
        "calendar_exports": [],
        "audit_log": [
            {
                "id": seed_id("audit:seed"),
                "actorUserId": admin_id,
                "actionType": "DATABASE_SEEDED",
                "entityType": "System",
                "entityId": seed_id("system"),
                "timestamp": ts("2026-04-01T08:00:00Z"),
                "category": "Change",
                "severity": "Info",
                "actorLabel": "Alicja Admin",
                "actionLabel": "Seed data loaded",
                "resourceLabel": "MVP database",
            }
        ],
    }


def seed_database(database_path: Path) -> None:
    """Replace current records with deterministic seed data."""
    initialize_database(database_path)
    store = RecordStore(database_path)
    store.clear()
    for kind, records in build_seed_records().items():
        for record in records:
            store.save(kind, record)


def ensure_seeded(database_path: Path) -> None:
    """Initialize and seed the database when it is empty."""
    initialize_database(database_path)
    connection = connect(database_path)
    try:
        row = connection.execute("SELECT COUNT(*) AS total FROM records").fetchone()
    finally:
        connection.close()
    if row is not None and row["total"] == 0:
        seed_database(database_path)
