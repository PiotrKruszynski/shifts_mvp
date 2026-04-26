from __future__ import annotations

from datetime import UTC, date, datetime, time, timedelta
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException

from app.db.repository import RecordStore, utc_now
from app.db.seed import seed_id

RecordList = list[dict[str, Any]]


def new_id() -> str:
    return str(uuid4())


def page_response(items: list[dict[str, Any]], page: int = 1, limit: int = 25) -> dict[str, Any]:
    total = len(items)
    start = max(page - 1, 0) * limit
    end = start + limit
    return {"data": items[start:end], "meta": {"page": page, "limit": limit, "total": total}}


def error(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(status_code=status_code, detail={"code": code, "message": message, "details": []})


def parse_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        return None
    prefix = "seed-token:"
    if token.startswith(prefix):
        return token.removeprefix(prefix)
    return None


def full_name(user: dict[str, Any]) -> str:
    return f"{user['firstName']} {user['lastName']}"


def period_label(schedule: dict[str, Any]) -> str:
    start = date.fromisoformat(schedule["periodStart"])
    return start.strftime("%B %Y")


def status_label(status: str) -> str:
    return {
        "DRAFT": "Szkic",
        "GENERATED": "Wygenerowany",
        "PUBLISHED": "Opublikowany",
        "ARCHIVED": "Zarchiwizowany",
    }.get(status, status)


def shift_category(shift: dict[str, Any]) -> str:
    weekday = date.fromisoformat(shift["date"]).weekday()
    return "Weekend" if weekday >= 5 else "Weekday"


def shift_day_name(shift: dict[str, Any]) -> str:
    return date.fromisoformat(shift["date"]).strftime("%A")


def starts_at(value: date) -> str:
    return datetime.combine(value, time(8, 0), tzinfo=UTC).isoformat().replace("+00:00", "Z")


def ends_at(value: date) -> str:
    return datetime.combine(value + timedelta(days=1), time(8, 0), tzinfo=UTC).isoformat().replace("+00:00", "Z")


class MvpService:
    """Application service implementing the OpenAPI MVP flows."""

    def __init__(self, database_path: Path) -> None:
        self.store = RecordStore(database_path)

    def public(self, item: dict[str, Any]) -> dict[str, Any]:
        return self.store.public(item)

    def list(self, kind: str) -> RecordList:
        return self.store.list_public(kind)

    def get(self, kind: str, record_id: str) -> dict[str, Any]:
        record = self.store.get(kind, record_id)
        if record is None:
            raise error(404, "NOT_FOUND", f"{kind} not found")
        return self.public(record)

    def save(self, kind: str, record: dict[str, Any]) -> dict[str, Any]:
        return self.store.save(kind, record)

    def actor(self, authorization: str | None) -> dict[str, Any]:
        user_id = parse_token(authorization)
        if user_id:
            return self.get("users", user_id)
        users = self.list("users")
        return next(user for user in users if any(role["role"] == "ADMIN" for role in user["roles"]))

    def user_by_email(self, email: str) -> dict[str, Any] | None:
        normalized = email.lower()
        return next((user for user in self.list("users") if user["email"].lower() == normalized), None)

    def doctor_for_user(self, user_id: str) -> dict[str, Any]:
        doctor = next((item for item in self.list("doctor_profiles") if item["userId"] == user_id), None)
        if doctor is None:
            raise error(404, "DOCTOR_PROFILE_NOT_FOUND", "Current user has no doctor profile")
        return doctor

    def user_for_doctor(self, doctor_id: str) -> dict[str, Any]:
        doctor = self.get("doctor_profiles", doctor_id)
        return self.get("users", doctor["userId"])

    def doctor_name(self, doctor_id: str) -> str:
        return full_name(self.user_for_doctor(doctor_id))

    def department_for_doctor(self, doctor: dict[str, Any]) -> dict[str, Any]:
        return self.get("departments", doctor["departmentId"])

    def login(self, payload: dict[str, Any]) -> dict[str, Any]:
        user = self.user_by_email(payload["email"])
        if user is None or payload.get("password") != user.get("_password", "password123"):
            raise error(401, "UNAUTHORIZED", "Invalid email or password")
        user["lastLoginAt"] = utc_now()
        self.save("users", user)
        return self.auth_response(user)

    def refresh(self, payload: dict[str, Any]) -> dict[str, Any]:
        user_id = str(payload["refreshToken"]).replace("refresh-token:", "")
        return self.auth_response(self.get("users", user_id))

    def auth_response(self, user: dict[str, Any]) -> dict[str, Any]:
        current = self.current_user(user)
        return {
            "accessToken": f"seed-token:{user['id']}",
            "refreshToken": f"refresh-token:{user['id']}",
            "expiresIn": 3600,
            "user": current,
        }

    def current_user(self, user: dict[str, Any]) -> dict[str, Any]:
        current = {
            "id": user["id"],
            "email": user["email"],
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "roles": user["roles"],
        }
        doctor = next((item for item in self.list("doctor_profiles") if item["userId"] == user["id"]), None)
        if doctor:
            current["doctorProfileId"] = doctor["id"]
        return current

    def audit(
        self,
        actor: dict[str, Any],
        action_type: str,
        entity_type: str,
        entity_id: str,
        before: dict[str, Any] | None = None,
        after: dict[str, Any] | None = None,
        reason: str | None = None,
    ) -> dict[str, Any]:
        entry = {
            "id": new_id(),
            "actorUserId": actor["id"],
            "actionType": action_type,
            "entityType": entity_type,
            "entityId": entity_id,
            "timestamp": utc_now(),
            "category": "Change",
            "severity": "Info",
            "actorLabel": full_name(actor),
            "actionLabel": action_type.replace("_", " ").title(),
            "resourceLabel": entity_type,
        }
        if before is not None:
            entry["payloadBefore"] = before
        if after is not None:
            entry["payloadAfter"] = after
        if reason:
            entry["reason"] = reason
        return self.save("audit_log", entry)

    def create_user(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        roles = []
        for item in payload["roles"]:
            role = {**item, "assignedAt": utc_now()}
            roles.append(role)
        user = {
            "id": new_id(),
            "email": payload["email"],
            "firstName": payload["firstName"],
            "lastName": payload["lastName"],
            "status": "INVITED",
            "roles": roles,
            "createdAt": utc_now(),
            "_password": "password123",
        }
        saved = self.save("users", user)
        self.audit(actor, "USER_CREATED", "User", saved["id"], after=saved)
        return saved

    def update_record(
        self, kind: str, record_id: str, payload: dict[str, Any], actor: dict[str, Any]
    ) -> dict[str, Any]:
        before = self.get(kind, record_id)
        updated = {**before, **{key: value for key, value in payload.items() if value is not None}}
        saved = self.save(kind, updated)
        self.audit(actor, f"{kind.upper()}_UPDATED", kind.title(), record_id, before=before, after=saved)
        return saved

    def replace_roles(self, user_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get("users", user_id)
        roles = [{**item, "assignedAt": utc_now()} for item in payload["roles"]]
        saved = self.save("users", {**before, "roles": roles})
        self.audit(actor, "USER_ROLES_REPLACED", "User", user_id, before=before, after=saved)
        return saved

    def create_department(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        record = {
            "id": new_id(),
            "name": payload["name"],
            "hospitalName": payload["hospitalName"],
            "timezone": payload.get("timezone", "Europe/Warsaw"),
            "active": True,
            "createdAt": utc_now(),
        }
        saved = self.save("departments", record)
        self.audit(actor, "DEPARTMENT_CREATED", "Department", saved["id"], after=saved)
        return saved

    def assign_coordinator(self, department_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        for assignment in self.list("coordinator_assignments"):
            if assignment["departmentId"] == department_id and assignment["active"]:
                self.save("coordinator_assignments", {**assignment, "active": False, "validTo": payload["validFrom"]})
        record = {
            "id": new_id(),
            "departmentId": department_id,
            "coordinatorUserId": payload["coordinatorUserId"],
            "validFrom": payload["validFrom"],
            "active": True,
        }
        saved = self.save("coordinator_assignments", record)
        self.audit(actor, "COORDINATOR_ASSIGNED", "Department", department_id, after=saved)
        return saved

    def department_summaries(self) -> dict[str, Any]:
        data = []
        for department in self.list("departments"):
            assignment = next(
                (
                    item
                    for item in self.list("coordinator_assignments")
                    if item["departmentId"] == department["id"] and item["active"]
                ),
                None,
            )
            coordinator = self.get("users", assignment["coordinatorUserId"]) if assignment else None
            doctors = [item for item in self.list("doctor_profiles") if item.get("departmentId") == department["id"]]
            schedules = [
                item
                for item in self.list("schedules")
                if item["departmentId"] == department["id"] and item["status"] != "ARCHIVED"
            ]
            data.append(
                {
                    "id": department["id"],
                    "name": department["name"],
                    "coordinator": full_name(coordinator) if coordinator else None,
                    "coordinatorEmail": coordinator["email"] if coordinator else None,
                    "doctorsCount": len(doctors),
                    "activeSchedules": len(schedules),
                    "assignedAt": assignment["validFrom"] if assignment else None,
                }
            )
        return {"data": data}

    def create_doctor_profile(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        department_id = payload.get("departmentId")
        if not department_id:
            user = self.get("users", payload["userId"])
            department_id = next((role.get("departmentId") for role in user["roles"] if role.get("departmentId")), None)
        record = {
            "id": new_id(),
            "userId": payload["userId"],
            "licenseNumber": payload["licenseNumber"],
            "employmentType": payload["employmentType"],
            "optOutSigned": payload.get("optOutSigned", False),
            "weeklyHourLimitMinutes": payload["weeklyHourLimitMinutes"],
            "active": True,
            "departmentId": department_id,
            "qualifications": payload.get("qualifications", []),
        }
        saved = self.save("doctor_profiles", record)
        self.audit(actor, "DOCTOR_PROFILE_CREATED", "DoctorProfile", saved["id"], after=saved)
        return saved

    def current_doctor_context(self, actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        department = self.department_for_doctor(doctor)
        return {
            "doctorProfileId": doctor["id"],
            "userId": actor["id"],
            "firstName": actor["firstName"],
            "fullName": full_name(actor),
            "departmentName": department["name"],
        }

    def create_invitation(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        record = {
            "id": new_id(),
            "departmentId": payload["departmentId"],
            "scheduleId": payload.get("scheduleId"),
            "invitedByUserId": actor["id"],
            "email": payload["email"],
            "status": "PENDING",
            "expiresAt": (datetime.now(UTC) + timedelta(days=14))
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z"),
            "_token": f"invite-token:{payload['email']}",
        }
        saved = self.save("doctor_invitations", record)
        self.audit(actor, "DOCTOR_INVITED", "DoctorInvitation", saved["id"], after=saved)
        return saved

    def accept_invitation(self, payload: dict[str, Any]) -> dict[str, Any]:
        invitation = next(
            (
                item
                for item in self.list("doctor_invitations")
                if item.get("_token") == payload["token"] or item["email"].lower() == payload["email"].lower()
            ),
            None,
        )
        department_id = invitation["departmentId"] if invitation else self.list("departments")[0]["id"]
        user = self.create_user(
            {
                "email": payload["email"],
                "firstName": payload["firstName"],
                "lastName": payload["lastName"],
                "roles": [{"role": "DOCTOR", "scope": "DEPARTMENT", "departmentId": department_id}],
            },
            self.list("users")[0],
        )
        user["_password"] = payload["password"]
        self.save("users", user)
        self.create_doctor_profile(
            {
                "userId": user["id"],
                "licenseNumber": f"PWZ-{user['id'][:8]}",
                "employmentType": "EMPLOYMENT_CONTRACT",
                "weeklyHourLimitMinutes": 2880,
                "departmentId": department_id,
            },
            user,
        )
        if invitation:
            self.save("doctor_invitations", {**invitation, "status": "ACCEPTED", "acceptedAt": utc_now()})
        return self.auth_response(user)

    def create_preference_category(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        record = {**payload, "id": new_id(), "description": payload.get("description", ""), "active": True}
        saved = self.save("preference_categories", record)
        self.audit(actor, "PREFERENCE_CATEGORY_CREATED", "PreferenceCategory", saved["id"], after=saved)
        return saved

    def get_settings(self) -> dict[str, Any]:
        return self.get("system_settings", "global")

    def save_settings(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get_settings()
        saved = self.save("system_settings", {"id": "global", **payload})
        self.audit(actor, "SYSTEM_SETTINGS_SAVED", "SystemSettings", "global", before=before, after=saved)
        return saved

    def current_schedule(self, department_id: str | None = None) -> dict[str, Any]:
        schedules = [item for item in self.list("schedules") if item["status"] != "ARCHIVED"]
        if department_id:
            schedules = [item for item in schedules if item["departmentId"] == department_id]
        if not schedules:
            raise error(404, "SCHEDULE_NOT_FOUND", "No current schedule found")
        priority = {"PUBLISHED": 0, "GENERATED": 1, "DRAFT": 2}
        return sorted(schedules, key=lambda item: (priority.get(item["status"], 9), item["periodStart"]))[0]

    def create_schedule(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        department = self.get("departments", payload["departmentId"])
        coordinator_id = actor["id"]
        assignment = next(
            (
                item
                for item in self.list("coordinator_assignments")
                if item["departmentId"] == department["id"] and item["active"]
            ),
            None,
        )
        if assignment:
            coordinator_id = assignment["coordinatorUserId"]
        schedule = {
            "id": new_id(),
            "departmentId": department["id"],
            "coordinatorUserId": coordinator_id,
            "periodStart": payload["periodStart"],
            "periodEnd": payload["periodEnd"],
            "availabilityDeadline": payload["availabilityDeadline"],
            "status": "DRAFT",
            "createdAt": utc_now(),
        }
        saved = self.save("schedules", schedule)
        for doctor_id in payload["participantDoctorProfileIds"]:
            self.add_participant(saved["id"], {"doctorProfileId": doctor_id}, actor, audit=False)
        current = date.fromisoformat(saved["periodStart"])
        end = date.fromisoformat(saved["periodEnd"])
        while current <= end:
            self.create_shift(
                saved["id"],
                {"date": current.isoformat(), "requiredQualificationId": payload.get("requiredQualificationId")},
                actor,
                audit=False,
            )
            current += timedelta(days=1)
        self.audit(actor, "SCHEDULE_CREATED", "Schedule", saved["id"], after=saved)
        return saved

    def ensure_editable(self, schedule: dict[str, Any]) -> None:
        if schedule["status"] in {"PUBLISHED", "ARCHIVED"}:
            raise error(409, "SCHEDULE_IMMUTABLE", "Published or archived schedules are immutable")

    def update_schedule(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        return self.update_record("schedules", schedule_id, payload, actor)

    def add_participant(
        self,
        schedule_id: str,
        payload: dict[str, Any],
        actor: dict[str, Any],
        audit: bool = True,
    ) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        existing = next(
            (
                item
                for item in self.list("schedule_participants")
                if item["scheduleId"] == schedule_id and item["doctorProfileId"] == payload["doctorProfileId"]
            ),
            None,
        )
        if existing:
            saved = self.save("schedule_participants", {**existing, "status": "ACTIVE", "removedAt": None})
        else:
            saved = self.save(
                "schedule_participants",
                {
                    "id": new_id(),
                    "scheduleId": schedule_id,
                    "doctorProfileId": payload["doctorProfileId"],
                    "status": "ACTIVE",
                    "addedAt": utc_now(),
                },
            )
        if audit:
            self.audit(actor, "SCHEDULE_PARTICIPANT_ADDED", "Schedule", schedule_id, after=saved)
        return saved

    def remove_participant(self, schedule_id: str, doctor_id: str, actor: dict[str, Any]) -> None:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        has_assignment = any(
            item
            for item in self.list("assignments")
            if item["scheduleId"] == schedule_id
            and item["doctorProfileId"] == doctor_id
            and item["status"] != "CANCELLED"
        )
        if has_assignment:
            raise error(409, "PARTICIPANT_HAS_ASSIGNMENTS", "Cannot remove a doctor with assignments")
        participant = next(
            (
                item
                for item in self.list("schedule_participants")
                if item["scheduleId"] == schedule_id and item["doctorProfileId"] == doctor_id
            ),
            None,
        )
        if participant:
            self.save(
                "schedule_participants",
                {**participant, "status": "REMOVED", "removedAt": utc_now()},
            )
            self.audit(actor, "SCHEDULE_PARTICIPANT_REMOVED", "Schedule", schedule_id, before=participant)

    def create_shift(
        self,
        schedule_id: str,
        payload: dict[str, Any],
        actor: dict[str, Any],
        audit: bool = True,
    ) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        value = date.fromisoformat(payload["date"])
        record = {
            "id": new_id(),
            "scheduleId": schedule_id,
            "date": payload["date"],
            "startsAt": starts_at(value),
            "endsAt": ends_at(value),
            "requiredQualificationId": payload.get("requiredQualificationId"),
            "status": "UNASSIGNED",
        }
        saved = self.save("shifts", record)
        if audit:
            self.audit(actor, "SHIFT_CREATED", "Shift", saved["id"], after=saved)
        return saved

    def update_shift(
        self, schedule_id: str, shift_id: str, payload: dict[str, Any], actor: dict[str, Any]
    ) -> dict[str, Any]:
        self.ensure_editable(self.get("schedules", schedule_id))
        return self.update_record("shifts", shift_id, payload, actor)

    def active_participants(self, schedule_id: str) -> RecordList:
        return [
            item
            for item in self.list("schedule_participants")
            if item["scheduleId"] == schedule_id and item["status"] == "ACTIVE"
        ]

    def active_assignments(self, schedule_id: str) -> RecordList:
        return [
            item
            for item in self.list("assignments")
            if item["scheduleId"] == schedule_id and item["status"] in {"PROPOSED", "CONFIRMED"}
        ]

    def assignment_for_shift(self, shift_id: str) -> dict[str, Any] | None:
        return next(
            (
                item
                for item in self.list("assignments")
                if item["shiftId"] == shift_id and item["status"] in {"PROPOSED", "CONFIRMED"}
            ),
            None,
        )

    def availability_for(self, schedule_id: str, doctor_id: str) -> dict[str, Any] | None:
        return next(
            (
                item
                for item in self.list("availability")
                if item["scheduleId"] == schedule_id and item["doctorProfileId"] == doctor_id
            ),
            None,
        )

    def get_my_availability(self, schedule_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        declaration = self.availability_for(schedule_id, doctor["id"])
        if declaration is None:
            return {
                "id": new_id(),
                "scheduleId": schedule_id,
                "doctorProfileId": doctor["id"],
                "status": "DRAFT",
                "days": [],
            }
        return declaration

    def submit_availability(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        deadline = datetime.fromisoformat(schedule["availabilityDeadline"].replace("Z", "+00:00"))
        if datetime.now(UTC) > deadline:
            raise error(409, "AVAILABILITY_DEADLINE_PASSED", "Availability deadline has passed")
        doctor = self.doctor_for_user(actor["id"])
        existing = self.availability_for(schedule_id, doctor["id"])
        days = [{**item, "id": new_id()} for item in payload["days"]]
        record = {
            "id": existing["id"] if existing else new_id(),
            "scheduleId": schedule_id,
            "doctorProfileId": doctor["id"],
            "status": "SUBMITTED",
            "submittedAt": utc_now(),
            "days": days,
        }
        saved = self.save("availability", record)
        self.audit(actor, "AVAILABILITY_SUBMITTED", "AvailabilityDeclaration", saved["id"], after=saved)
        return saved

    def is_doctor_available(self, schedule_id: str, doctor_id: str, shift: dict[str, Any]) -> bool:
        declaration = self.availability_for(schedule_id, doctor_id)
        if not declaration:
            return True
        day = next((item for item in declaration["days"] if item["date"] == shift["date"]), None)
        return day is None or day["availabilityType"] != "UNAVAILABLE"

    def has_approved_leave(self, schedule_id: str, doctor_id: str, shift: dict[str, Any]) -> bool:
        shift_date = date.fromisoformat(shift["date"])
        for leave in self.list("leave_requests"):
            if (
                leave["scheduleId"] != schedule_id
                or leave["doctorProfileId"] != doctor_id
                or leave["status"] != "APPROVED"
            ):
                continue
            if date.fromisoformat(leave["dateFrom"]) <= shift_date <= date.fromisoformat(leave["dateTo"]):
                return True
        return False

    def has_rest_conflict(
        self,
        schedule_id: str,
        doctor_id: str,
        shift: dict[str, Any],
        ignore_assignment_ids: set[str] | None = None,
    ) -> bool:
        ignore_assignment_ids = ignore_assignment_ids or set()
        shift_date = date.fromisoformat(shift["date"])
        shifts = {item["id"]: item for item in self.list("shifts") if item["scheduleId"] == schedule_id}
        for assignment in self.active_assignments(schedule_id):
            if assignment["id"] in ignore_assignment_ids or assignment["doctorProfileId"] != doctor_id:
                continue
            assigned_shift = shifts[assignment["shiftId"]]
            delta = abs((date.fromisoformat(assigned_shift["date"]) - shift_date).days)
            if delta <= 1:
                return True
        return False

    def validate_assignment(
        self,
        schedule_id: str,
        shift_id: str,
        doctor_id: str,
        ignore_assignment_ids: set[str] | None = None,
    ) -> RecordList:
        shift = self.get("shifts", shift_id)
        violations = []
        rule_availability = seed_id("constraint:availability")
        rule_rest = seed_id("constraint:min-rest")
        if not self.is_doctor_available(schedule_id, doctor_id, shift):
            violations.append(
                {
                    "id": new_id(),
                    "constraintRuleId": rule_availability,
                    "severity": "BLOCKING",
                    "message": "Doctor is unavailable for this shift",
                    "doctorProfileId": doctor_id,
                    "shiftId": shift_id,
                }
            )
        if self.has_approved_leave(schedule_id, doctor_id, shift):
            violations.append(
                {
                    "id": new_id(),
                    "constraintRuleId": rule_availability,
                    "severity": "BLOCKING",
                    "message": "Doctor has approved leave for this shift",
                    "doctorProfileId": doctor_id,
                    "shiftId": shift_id,
                }
            )
        if self.has_rest_conflict(schedule_id, doctor_id, shift, ignore_assignment_ids):
            violations.append(
                {
                    "id": new_id(),
                    "constraintRuleId": rule_rest,
                    "severity": "BLOCKING",
                    "message": "Doctor would work adjacent 24-hour shifts",
                    "doctorProfileId": doctor_id,
                    "shiftId": shift_id,
                }
            )
        return violations

    def validation_result(
        self,
        target_type: str,
        target_id: str,
        violations: RecordList,
    ) -> dict[str, Any]:
        return {
            "id": new_id(),
            "targetType": target_type,
            "targetId": target_id,
            "isCompliant": not any(item["severity"] == "BLOCKING" for item in violations),
            "validatedAt": utc_now(),
            "violations": violations,
        }

    def create_assignment(
        self,
        schedule_id: str,
        payload: dict[str, Any],
        actor: dict[str, Any],
        source: str = "MANUAL",
        audit: bool = True,
    ) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        self.ensure_editable(schedule)
        existing = self.assignment_for_shift(payload["shiftId"])
        if existing:
            self.save("assignments", {**existing, "status": "REPLACED"})
        violations = self.validate_assignment(schedule_id, payload["shiftId"], payload["doctorProfileId"])
        if violations:
            raise HTTPException(
                status_code=422,
                detail=self.validation_result("ASSIGNMENT", payload["shiftId"], violations),
            )
        record = {
            "id": new_id(),
            "scheduleId": schedule_id,
            "shiftId": payload["shiftId"],
            "doctorProfileId": payload["doctorProfileId"],
            "status": "CONFIRMED",
            "source": source,
            "createdAt": utc_now(),
            "confirmedAt": utc_now(),
        }
        saved = self.save("assignments", record)
        shift = self.get("shifts", payload["shiftId"])
        self.save("shifts", {**shift, "status": "ASSIGNED"})
        if audit:
            self.audit(actor, "ASSIGNMENT_CREATED", "Assignment", saved["id"], after=saved)
        return saved

    def update_assignment(
        self, schedule_id: str, assignment_id: str, payload: dict[str, Any], actor: dict[str, Any]
    ) -> dict[str, Any]:
        self.ensure_editable(self.get("schedules", schedule_id))
        before = self.get("assignments", assignment_id)
        doctor_id = payload.get("doctorProfileId", before["doctorProfileId"])
        violations = self.validate_assignment(schedule_id, before["shiftId"], doctor_id, {assignment_id})
        if violations:
            raise HTTPException(status_code=422, detail=self.validation_result("ASSIGNMENT", assignment_id, violations))
        saved = self.save("assignments", {**before, **payload})
        self.audit(actor, "ASSIGNMENT_UPDATED", "Assignment", assignment_id, before=before, after=saved)
        return saved

    def cancel_assignment(self, schedule_id: str, assignment_id: str, actor: dict[str, Any]) -> None:
        self.ensure_editable(self.get("schedules", schedule_id))
        assignment = self.get("assignments", assignment_id)
        self.save("assignments", {**assignment, "status": "CANCELLED"})
        shift = self.get("shifts", assignment["shiftId"])
        self.save("shifts", {**shift, "status": "UNASSIGNED"})
        self.audit(actor, "ASSIGNMENT_CANCELLED", "Assignment", assignment_id, before=assignment)

    def validate_schedule(self, schedule_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        payload = payload or {}
        if proposed := payload.get("proposedAssignment"):
            violations = self.validate_assignment(schedule_id, proposed["shiftId"], proposed["doctorProfileId"])
            return self.validation_result("ASSIGNMENT", proposed["shiftId"], violations)
        violations = []
        for shift in self.list("shifts"):
            if shift["scheduleId"] != schedule_id:
                continue
            if not self.assignment_for_shift(shift["id"]):
                violations.append(
                    {
                        "id": new_id(),
                        "constraintRuleId": seed_id("constraint:availability"),
                        "severity": "BLOCKING",
                        "message": f"Shift {shift['date']} is unassigned",
                        "shiftId": shift["id"],
                    }
                )
        return self.validation_result("SCHEDULE", schedule_id, violations)

    def generate_schedule(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        if schedule["status"] not in {"DRAFT", "GENERATED"}:
            raise error(409, "SCHEDULE_STATUS_INVALID", "Only draft or generated schedules can be generated")
        dry_run = payload.get("dryRun", False)
        shifts = [item for item in self.list("shifts") if item["scheduleId"] == schedule_id]
        participants = self.active_participants(schedule_id)
        assignments_to_create = []
        conflict_items = []
        temp_assigned: list[tuple[str, str]] = []
        for shift in sorted(shifts, key=lambda item: item["date"]):
            chosen = None
            for participant in participants:
                doctor_id = participant["doctorProfileId"]
                temp_conflict = any(
                    doctor_id == assigned_doctor
                    and abs((date.fromisoformat(assigned_date) - date.fromisoformat(shift["date"])).days) <= 1
                    for assigned_doctor, assigned_date in temp_assigned
                )
                if temp_conflict:
                    continue
                if self.validate_assignment(schedule_id, shift["id"], doctor_id):
                    continue
                chosen = doctor_id
                break
            if chosen is None:
                conflict_items.append(
                    {
                        "id": new_id(),
                        "shiftId": shift["id"],
                        "reasonCode": "NO_AVAILABLE_DOCTOR",
                        "description": f"No compliant doctor for {shift['date']}",
                    }
                )
            else:
                temp_assigned.append((chosen, shift["date"]))
                assignments_to_create.append({"shiftId": shift["id"], "doctorProfileId": chosen})

        run = {
            "id": new_id(),
            "scheduleId": schedule_id,
            "startedByUserId": actor["id"],
            "startedAt": utc_now(),
            "finishedAt": utc_now(),
            "status": "SUCCEEDED" if not conflict_items else "FAILED",
            "algorithmVersion": payload.get("algorithmVersion", "mvp-deterministic-v1"),
            "createdAssignmentCount": 0 if dry_run else len(assignments_to_create),
        }
        if conflict_items:
            report = {
                "id": new_id(),
                "scheduleId": schedule_id,
                "generationRunId": run["id"],
                "createdAt": utc_now(),
                "summary": f"{len(conflict_items)} shifts could not be assigned",
                "items": conflict_items,
            }
            saved_report = self.save("conflict_reports", report)
            run["conflictReportId"] = saved_report["id"]
            if not dry_run:
                for item in conflict_items:
                    shift = self.get("shifts", item["shiftId"])
                    self.save("shifts", {**shift, "status": "CONFLICTED"})
        elif not dry_run:
            for assignment in self.active_assignments(schedule_id):
                if assignment["source"] in {"GENERATED", "MANUAL"}:
                    self.save("assignments", {**assignment, "status": "REPLACED"})
            for assignment_payload in assignments_to_create:
                self.create_assignment(schedule_id, assignment_payload, actor, source="GENERATED", audit=False)
            self.save("schedules", {**schedule, "status": "GENERATED"})

        saved_run = self.save("generation_runs", run)
        self.audit(actor, "SCHEDULE_GENERATED", "Schedule", schedule_id, after=saved_run)
        return saved_run

    def conflict_report_for_run(self, generation_run_id: str) -> dict[str, Any]:
        report = next(
            (item for item in self.list("conflict_reports") if item["generationRunId"] == generation_run_id),
            None,
        )
        if report is None:
            raise error(404, "CONFLICT_REPORT_NOT_FOUND", "Conflict report not found")
        return report

    def publish_schedule(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        result = self.validate_schedule(schedule_id)
        if not result["isCompliant"]:
            raise HTTPException(status_code=422, detail=result)
        if schedule["status"] not in {"GENERATED", "DRAFT"}:
            raise error(409, "SCHEDULE_STATUS_INVALID", "Only generated schedules can be published")
        saved = self.save("schedules", {**schedule, "status": "PUBLISHED", "publishedAt": utc_now()})
        for participant in self.active_participants(schedule_id):
            doctor = self.get("doctor_profiles", participant["doctorProfileId"])
            notification = {
                "id": new_id(),
                "recipientUserId": doctor["userId"],
                "channel": "EMAIL",
                "type": "SCHEDULE_PUBLISHED",
                "title": "Grafik opublikowany",
                "body": f"Grafik {period_label(saved)} zostal opublikowany.",
                "status": "SENT",
                "sentAt": utc_now(),
            }
            self.save("notifications", notification)
        self.audit(
            actor,
            "SCHEDULE_PUBLISHED",
            "Schedule",
            schedule_id,
            before=schedule,
            after=saved,
            reason=payload.get("comment"),
        )
        return saved

    def archive_schedule(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        saved = self.save("schedules", {**schedule, "status": "ARCHIVED", "archivedAt": utc_now()})
        self.audit(
            actor,
            "SCHEDULE_ARCHIVED",
            "Schedule",
            schedule_id,
            before=schedule,
            after=saved,
            reason=payload.get("reason"),
        )
        return saved

    def schedule_editor(self, schedule_id: str) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        shifts = []
        conflicts = []
        for shift in sorted(
            [item for item in self.list("shifts") if item["scheduleId"] == schedule_id], key=lambda item: item["date"]
        ):
            assignment = self.assignment_for_shift(shift["id"])
            issues = []
            if not assignment:
                issues.append("Unassigned shift")
                conflicts.append(
                    {
                        "id": new_id(),
                        "shiftId": shift["id"],
                        "reasonCode": "UNASSIGNED_SHIFT",
                        "description": f"Shift {shift['date']} has no doctor",
                    }
                )
            shifts.append(
                {
                    "shift": shift,
                    "assignment": assignment,
                    "doctorName": self.doctor_name(assignment["doctorProfileId"]) if assignment else None,
                    "category": shift_category(shift),
                    "valid": not issues,
                    "issues": issues,
                }
            )
        return {
            "schedule": schedule,
            "periodLabel": period_label(schedule),
            "dateRangeLabel": f"{schedule['periodStart']} - {schedule['periodEnd']}",
            "shifts": shifts,
            "conflicts": conflicts,
        }

    def coordinator_dashboard(self, schedule_id: str) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        shifts = [item for item in self.list("shifts") if item["scheduleId"] == schedule_id]
        participants = self.active_participants(schedule_id)
        invitations = [
            item
            for item in self.list("doctor_invitations")
            if item.get("scheduleId") == schedule_id or item["departmentId"] == schedule["departmentId"]
        ]
        return {
            "id": schedule_id,
            "period": period_label(schedule),
            "dateRange": f"{schedule['periodStart']} - {schedule['periodEnd']}",
            "status": status_label(schedule["status"]),
            "deadline": schedule["availabilityDeadline"][:10],
            "unassignedShifts": len([item for item in shifts if item["status"] != "ASSIGNED"]),
            "conflicts": len([item for item in shifts if item["status"] == "CONFLICTED"]),
            "pendingSwaps": len(
                [
                    item
                    for item in self.list("swap_requests")
                    if item["scheduleId"] == schedule_id
                    and item["status"] not in {"APPROVED", "REJECTED_BY_COORDINATOR"}
                ]
            ),
            "doctors": len(participants),
            "activeDoctors": len(participants),
            "invitedDoctors": len([item for item in invitations if item["status"] == "PENDING"]),
            "shifts": len(shifts),
            "availabilitySubmitted": len(
                [item for item in self.list("availability") if item["scheduleId"] == schedule_id]
            ),
        }

    def availability_collection(self, schedule_id: str) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        doctors = []
        for participant in self.active_participants(schedule_id):
            declaration = self.availability_for(schedule_id, participant["doctorProfileId"])
            doctors.append(
                {
                    "id": participant["doctorProfileId"],
                    "name": self.doctor_name(participant["doctorProfileId"]),
                    "status": "Zaakceptowane" if declaration and declaration["status"] == "SUBMITTED" else "Oczekuje",
                    "submittedAt": declaration["submittedAt"][:10]
                    if declaration and declaration.get("submittedAt")
                    else None,
                }
            )
        return {
            "scheduleId": schedule_id,
            "periodLabel": period_label(schedule),
            "dateRangeLabel": f"{schedule['periodStart']} - {schedule['periodEnd']}",
            "deadlineDate": schedule["availabilityDeadline"][:10],
            "statusLabel": status_label(schedule["status"]),
            "doctors": doctors,
        }

    def doctor_dashboard(self, schedule_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        schedule = self.get("schedules", schedule_id)
        department = self.department_for_doctor(doctor)
        assignments = [item for item in self.active_assignments(schedule_id) if item["doctorProfileId"] == doctor["id"]]
        shifts = {item["id"]: item for item in self.list("shifts") if item["scheduleId"] == schedule_id}
        upcoming = None
        if assignments:
            shift = shifts[assignments[0]["shiftId"]]
            upcoming = {
                "date": shift["date"],
                "day": shift_day_name(shift),
                "category": shift_category(shift),
                "hours": "24h",
            }
        return {
            "doctorFirstName": actor["firstName"],
            "departmentName": department["name"],
            "schedule": schedule,
            "scheduleStatusLabel": status_label(schedule["status"]),
            "periodLabel": period_label(schedule),
            "availabilityDeadline": schedule["availabilityDeadline"][:10],
            "upcomingShift": upcoming
            or {"date": schedule["periodStart"], "day": "", "category": "Weekday", "hours": "0h"},
            "canRequestSwap": schedule["status"] == "PUBLISHED" and bool(assignments),
            "pendingSwap": None,
        }

    def doctor_schedule(self, schedule_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        schedule = self.get("schedules", schedule_id)
        department = self.department_for_doctor(doctor)
        data = []
        for assignment in self.active_assignments(schedule_id):
            if assignment["doctorProfileId"] != doctor["id"]:
                continue
            shift = self.get("shifts", assignment["shiftId"])
            data.append(
                {
                    "shift": shift,
                    "assignment": assignment,
                    "day": shift_day_name(shift),
                    "department": department["name"],
                    "category": shift_category(shift),
                    "categoryDay": shift["date"],
                    "scheduleStatus": schedule["status"],
                    "canSwap": schedule["status"] == "PUBLISHED",
                }
            )
        return {"periodLabel": period_label(schedule), "shifts": data}

    def create_leave(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        record = {
            "id": new_id(),
            "scheduleId": schedule_id,
            "doctorProfileId": doctor["id"],
            "dateFrom": payload["dateFrom"],
            "dateTo": payload["dateTo"],
            "status": "SUBMITTED",
            "submittedAt": date.today().isoformat(),
            "typeLabel": payload["typeLabel"],
            "reason": payload.get("reason", ""),
        }
        saved = self.save("leave_requests", record)
        self.audit(actor, "LEAVE_REQUEST_CREATED", "LeaveRequest", saved["id"], after=saved)
        return saved

    def leave_items(self, schedule_id: str, doctor_id: str | None = None, status: str | None = None) -> dict[str, Any]:
        data = []
        for item in self.list("leave_requests"):
            if item["scheduleId"] != schedule_id:
                continue
            if doctor_id and item["doctorProfileId"] != doctor_id:
                continue
            if status and item["status"] != status:
                continue
            data.append(
                {
                    "request": item,
                    "doctorName": self.doctor_name(item["doctorProfileId"]),
                    "typeLabel": item.get("typeLabel", "Urlop"),
                    "submittedAt": item["submittedAt"],
                    "rejectionReason": item.get("rejectionReason"),
                }
            )
        return {"data": data}

    def decide_leave(
        self, leave_id: str, status: str, payload: dict[str, Any], actor: dict[str, Any]
    ) -> dict[str, Any]:
        before = self.get("leave_requests", leave_id)
        updated = {
            **before,
            "status": status,
            "reviewedByUserId": actor["id"],
            "reviewedAt": utc_now(),
        }
        if status == "REJECTED":
            updated["rejectionReason"] = payload.get("comment", "")
        saved = self.save("leave_requests", updated)
        self.audit(actor, f"LEAVE_REQUEST_{status}", "LeaveRequest", leave_id, before=before, after=saved)
        return saved

    def cancel_leave(self, leave_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get("leave_requests", leave_id)
        saved = self.save("leave_requests", {**before, "status": "CANCELLED"})
        self.audit(actor, "LEAVE_REQUEST_CANCELLED", "LeaveRequest", leave_id, before=before, after=saved)
        return saved

    def swap_options(self, schedule_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        doctor = self.doctor_for_user(actor["id"])
        enabled = schedule["status"] == "PUBLISHED"
        assignments = self.active_assignments(schedule_id)
        shifts = {item["id"]: item for item in self.list("shifts") if item["scheduleId"] == schedule_id}

        def option(assignment: dict[str, Any]) -> dict[str, Any]:
            shift = shifts[assignment["shiftId"]]
            return {
                "shift": shift,
                "assignment": assignment,
                "day": shift_day_name(shift),
                "categoryLabel": shift_category(shift),
            }

        my_shifts = [option(item) for item in assignments if item["doctorProfileId"] == doctor["id"]]
        doctors = []
        for participant in self.active_participants(schedule_id):
            if participant["doctorProfileId"] == doctor["id"]:
                continue
            doctor_assignments = [
                item for item in assignments if item["doctorProfileId"] == participant["doctorProfileId"]
            ]
            doctors.append(
                {
                    "id": participant["doctorProfileId"],
                    "name": self.doctor_name(participant["doctorProfileId"]),
                    "shifts": [option(item) for item in doctor_assignments],
                }
            )
        return {"enabled": enabled, "scheduleStatus": schedule["status"], "myShifts": my_shifts, "doctors": doctors}

    def create_swap(self, schedule_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        if schedule["status"] != "PUBLISHED":
            raise error(409, "SWAPS_UNAVAILABLE", "Swaps require a published schedule")
        doctor = self.doctor_for_user(actor["id"])
        source = self.get("assignments", payload["sourceAssignmentId"])
        if source["doctorProfileId"] != doctor["id"]:
            raise error(409, "SOURCE_ASSIGNMENT_NOT_OWNED", "Source assignment is not owned by current doctor")
        swap_id = new_id()
        candidates = [
            {
                "id": new_id(),
                "swapRequestId": swap_id,
                "doctorProfileId": item["doctorProfileId"],
                "assignmentId": item.get("assignmentId"),
                "responseStatus": "PENDING",
            }
            for item in payload["candidates"]
        ]
        record = {
            "id": swap_id,
            "scheduleId": schedule_id,
            "requestingDoctorId": doctor["id"],
            "sourceAssignmentId": payload["sourceAssignmentId"],
            "targetAssignmentId": payload.get("targetAssignmentId"),
            "status": "PENDING_DOCTOR_ACCEPTANCE",
            "candidates": candidates,
            "createdAt": utc_now(),
            "updatedAt": utc_now(),
        }
        saved = self.save("swap_requests", record)
        self.audit(actor, "SWAP_REQUEST_CREATED", "SwapRequest", saved["id"], after=saved)
        return saved

    def respond_swap(self, swap_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get("swap_requests", swap_id)
        doctor = self.doctor_for_user(actor["id"])
        candidates = []
        accepted_candidate = None
        for candidate in before["candidates"]:
            if candidate["doctorProfileId"] == doctor["id"] and candidate["responseStatus"] == "PENDING":
                candidate = {
                    **candidate,
                    "responseStatus": "ACCEPTED" if payload["decision"] == "ACCEPT" else "REJECTED",
                    "respondedAt": utc_now(),
                }
                if payload["decision"] == "ACCEPT":
                    accepted_candidate = candidate
            candidates.append(candidate)
        if accepted_candidate:
            status = "PENDING_COORDINATOR_APPROVAL"
            target_doctor_id = accepted_candidate["doctorProfileId"]
            target_assignment_id = accepted_candidate.get("assignmentId") or before.get("targetAssignmentId")
        elif all(item["responseStatus"] == "REJECTED" for item in candidates):
            status = "REJECTED_BY_DOCTOR"
            target_doctor_id = before.get("targetDoctorId")
            target_assignment_id = before.get("targetAssignmentId")
        else:
            status = before["status"]
            target_doctor_id = before.get("targetDoctorId")
            target_assignment_id = before.get("targetAssignmentId")
        saved = self.save(
            "swap_requests",
            {
                **before,
                "candidates": candidates,
                "status": status,
                "targetDoctorId": target_doctor_id,
                "targetAssignmentId": target_assignment_id,
                "updatedAt": utc_now(),
            },
        )
        self.audit(actor, "SWAP_REQUEST_RESPONDED", "SwapRequest", swap_id, before=before, after=saved)
        return saved

    def validate_swap(self, swap_id: str) -> dict[str, Any]:
        swap = self.get("swap_requests", swap_id)
        violations = []
        source = self.get("assignments", swap["sourceAssignmentId"])
        source_shift = self.get("shifts", source["shiftId"])
        target_doctor_id = swap.get("targetDoctorId")
        if not target_doctor_id:
            violations.append(
                {
                    "id": new_id(),
                    "constraintRuleId": seed_id("constraint:availability"),
                    "severity": "BLOCKING",
                    "message": "No doctor has accepted this swap",
                    "shiftId": source_shift["id"],
                }
            )
        else:
            violations.extend(
                self.validate_assignment(swap["scheduleId"], source["shiftId"], target_doctor_id, {source["id"]})
            )
            if swap.get("targetAssignmentId"):
                target = self.get("assignments", swap["targetAssignmentId"])
                violations.extend(
                    self.validate_assignment(
                        swap["scheduleId"], target["shiftId"], source["doctorProfileId"], {target["id"]}
                    )
                )
        result = self.validation_result("SWAP_REQUEST", swap_id, violations)
        self.save("swap_requests", {**swap, "validationResult": result, "updatedAt": utc_now()})
        return result

    def approve_swap(self, swap_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get("swap_requests", swap_id)
        result = self.validate_swap(swap_id)
        if not result["isCompliant"]:
            raise HTTPException(status_code=422, detail=result)
        swap = self.get("swap_requests", swap_id)
        source = self.get("assignments", swap["sourceAssignmentId"])
        target_assignment = (
            self.get("assignments", swap["targetAssignmentId"]) if swap.get("targetAssignmentId") else None
        )
        self.save("assignments", {**source, "status": "REPLACED"})
        self.save(
            "assignments",
            {
                "id": new_id(),
                "scheduleId": swap["scheduleId"],
                "shiftId": source["shiftId"],
                "doctorProfileId": swap["targetDoctorId"],
                "status": "CONFIRMED",
                "source": "SWAP",
                "createdAt": utc_now(),
                "confirmedAt": utc_now(),
            },
        )
        if target_assignment:
            self.save("assignments", {**target_assignment, "status": "REPLACED"})
            self.save(
                "assignments",
                {
                    "id": new_id(),
                    "scheduleId": swap["scheduleId"],
                    "shiftId": target_assignment["shiftId"],
                    "doctorProfileId": source["doctorProfileId"],
                    "status": "CONFIRMED",
                    "source": "SWAP",
                    "createdAt": utc_now(),
                    "confirmedAt": utc_now(),
                },
            )
        approval = {
            "id": new_id(),
            "swapRequestId": swap_id,
            "coordinatorUserId": actor["id"],
            "decision": "APPROVED",
            "comment": payload.get("comment", ""),
            "decidedAt": utc_now(),
        }
        saved = self.save(
            "swap_requests",
            {
                **swap,
                "status": "APPROVED",
                "approval": approval,
                "validationResult": result,
                "updatedAt": utc_now(),
            },
        )
        self.audit(actor, "SWAP_REQUEST_APPROVED", "SwapRequest", swap_id, before=before, after=saved)
        return saved

    def reject_swap(self, swap_id: str, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        before = self.get("swap_requests", swap_id)
        approval = {
            "id": new_id(),
            "swapRequestId": swap_id,
            "coordinatorUserId": actor["id"],
            "decision": "REJECTED",
            "comment": payload.get("comment", ""),
            "decidedAt": utc_now(),
        }
        saved = self.save(
            "swap_requests",
            {**before, "status": "REJECTED_BY_COORDINATOR", "approval": approval, "updatedAt": utc_now()},
        )
        self.audit(actor, "SWAP_REQUEST_REJECTED", "SwapRequest", swap_id, before=before, after=saved)
        return saved

    def doctor_swap_approval(self, swap_id: str, actor: dict[str, Any]) -> dict[str, Any]:
        swap = self.get("swap_requests", swap_id)
        source = self.get("assignments", swap["sourceAssignmentId"])
        source_shift = self.get("shifts", source["shiftId"])
        target_assignment_id = swap.get("targetAssignmentId")
        target_shift = (
            self.get("shifts", self.get("assignments", target_assignment_id)["shiftId"])
            if target_assignment_id
            else source_shift
        )
        return {
            "id": swap_id,
            "fromDoctor": self.doctor_name(swap["requestingDoctorId"]),
            "myShift": {
                "date": target_shift["date"],
                "day": shift_day_name(target_shift),
                "category": shift_category(target_shift),
            },
            "theirShift": {
                "date": source_shift["date"],
                "day": shift_day_name(source_shift),
                "category": shift_category(source_shift),
            },
            "requestedAt": swap["createdAt"][:10],
            "valid": True,
            "issues": [],
        }

    def coordinator_swap_approvals(self, schedule_id: str) -> dict[str, Any]:
        data = []
        for swap in self.list("swap_requests"):
            if swap["scheduleId"] != schedule_id:
                continue
            source = self.get("assignments", swap["sourceAssignmentId"])
            source_shift = self.get("shifts", source["shiftId"])
            target_assignment = (
                self.get("assignments", swap["targetAssignmentId"]) if swap.get("targetAssignmentId") else None
            )
            target_shift = self.get("shifts", target_assignment["shiftId"]) if target_assignment else source_shift
            data.append(
                {
                    "id": swap["id"],
                    "doctorA": self.doctor_name(swap["requestingDoctorId"]),
                    "doctorB": self.doctor_name(swap.get("targetDoctorId") or swap["candidates"][0]["doctorProfileId"]),
                    "shiftA": source_shift["date"],
                    "shiftB": target_shift["date"],
                    "status": {"APPROVED": "Approved", "REJECTED_BY_COORDINATOR": "Rejected"}.get(
                        swap["status"], "Pending"
                    ),
                    "valid": swap.get("validationResult", {"isCompliant": True})["isCompliant"],
                    "issues": [item["message"] for item in swap.get("validationResult", {}).get("violations", [])],
                    "requestedAt": swap["createdAt"][:10],
                }
            )
        return {"data": data}

    def metrics(self, schedule_id: str) -> dict[str, Any]:
        schedule = self.get("schedules", schedule_id)
        assignments = self.active_assignments(schedule_id)
        shifts = [item for item in self.list("shifts") if item["scheduleId"] == schedule_id]
        doctor_metrics = []
        for participant in self.active_participants(schedule_id):
            doctor_id = participant["doctorProfileId"]
            doctor_assignments = [item for item in assignments if item["doctorProfileId"] == doctor_id]
            doctor_shifts = [self.get("shifts", item["shiftId"]) for item in doctor_assignments]
            weekday = len([item for item in doctor_shifts if shift_category(item) == "Weekday"])
            weekend = len(doctor_shifts) - weekday
            doctor_metrics.append(
                {
                    "doctorProfileId": doctor_id,
                    "doctorName": self.doctor_name(doctor_id),
                    "assignmentCount": len(doctor_assignments),
                    "weekdayShiftCount": weekday,
                    "weekendShiftCount": weekend,
                    "holidayShiftCount": 0,
                    "categoryICount": 0,
                    "categoryIICount": weekend,
                    "categoryIIICount": weekday,
                    "totalDutyMinutes": len(doctor_assignments) * 1440,
                    "totalHours": len(doctor_assignments) * 24,
                    "overtimeMinutes": 0,
                    "optOutUsed": self.get("doctor_profiles", doctor_id)["optOutSigned"],
                    "restComplianceStatus": "COMPLIANT",
                }
            )
        assigned = len(assignments)
        return {
            "scheduleId": schedule_id,
            "periodLabel": period_label(schedule),
            "generatedAt": schedule.get("publishedAt") or schedule.get("createdAt") or utc_now(),
            "summary": {
                "assignedShiftCount": assigned,
                "unassignedShiftCount": len(shifts) - assigned,
                "violationCount": len(self.validate_schedule(schedule_id)["violations"]),
                "averageDutiesPerDoctor": assigned / max(len(doctor_metrics), 1),
            },
            "doctorMetrics": doctor_metrics,
        }

    def mark_notification_read(self, notification_id: str) -> dict[str, Any]:
        notification = self.get("notifications", notification_id)
        return self.save("notifications", {**notification, "status": "READ"})

    def create_calendar_export(self, payload: dict[str, Any], actor: dict[str, Any]) -> dict[str, Any]:
        doctor = self.doctor_for_user(actor["id"])
        token = uuid4().hex + uuid4().hex
        record = {
            "id": new_id(),
            "doctorProfileId": doctor["id"],
            "scheduleId": payload["scheduleId"],
            "enabled": True,
            "icsUrl": f"http://localhost:8000/api/v1/calendar-exports/{token}.ics",
            "lastSyncedAt": utc_now(),
            "_token": token,
        }
        return self.save("calendar_exports", record)

    def revoke_calendar_export(self, export_id: str) -> None:
        export = self.get("calendar_exports", export_id)
        self.save("calendar_exports", {**export, "enabled": False})

    def ics_calendar(self, token: str) -> str:
        export = next(
            (item for item in self.store.list("calendar_exports") if item.get("_token") == token and item["enabled"]),
            None,
        )
        if export is None:
            raise error(404, "CALENDAR_EXPORT_NOT_FOUND", "Calendar export not found")
        assignments = [
            item
            for item in self.active_assignments(export["scheduleId"])
            if item["doctorProfileId"] == export["doctorProfileId"]
        ]
        lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Shifts MVP//EN"]
        for assignment in assignments:
            shift = self.get("shifts", assignment["shiftId"])
            lines.extend(
                [
                    "BEGIN:VEVENT",
                    f"UID:{assignment['id']}@shifts-mvp",
                    f"DTSTART;VALUE=DATE:{shift['date'].replace('-', '')}",
                    f"SUMMARY:Dyzur lekarski {shift['date']}",
                    "END:VEVENT",
                ]
            )
        lines.append("END:VCALENDAR")
        return "\r\n".join(lines)
