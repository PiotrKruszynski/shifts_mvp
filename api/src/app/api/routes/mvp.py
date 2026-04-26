from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, Depends, Header, Query, Request, Response
from fastapi.responses import PlainTextResponse

from app.services.mvp import MvpService, page_response

router = APIRouter()


def service(request: Request) -> MvpService:
    return MvpService(request.app.state.settings.database_path)


def current_actor(
    authorization: str | None = Header(default=None, alias="Authorization"),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.actor(authorization)


@router.post("/auth/login", status_code=200)
def login(payload: dict[str, Any] = Body(...), svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.login(payload)


@router.post("/auth/refresh")
def refresh_token(payload: dict[str, Any] = Body(...), svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.refresh(payload)


@router.get("/auth/me")
def get_current_user(
    actor: dict[str, Any] = Depends(current_actor), svc: MvpService = Depends(service)
) -> dict[str, Any]:
    return svc.current_user(actor)


@router.post("/auth/password-reset-requests", status_code=202)
def request_password_reset(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"email": payload["email"], "sent": True}


@router.get("/users")
def list_users(
    page: int = 1,
    limit: int = 25,
    role: str | None = None,
    status: str | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    users = svc.list("users")
    if role:
        users = [item for item in users if any(user_role["role"] == role for user_role in item["roles"])]
    if status:
        users = [item for item in users if item["status"] == status]
    return page_response(users, page, limit)


@router.post("/users", status_code=201)
def create_user(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_user(payload, actor)


@router.get("/users/{user_id}")
def get_user(user_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("users", user_id)


@router.patch("/users/{user_id}")
def update_user(
    user_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_record("users", user_id, payload, actor)


@router.put("/users/{user_id}/roles")
def replace_user_roles(
    user_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.replace_roles(user_id, payload, actor)


@router.get("/departments")
def list_departments(
    page: int = 1,
    limit: int = 25,
    active: bool | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    departments = svc.list("departments")
    if active is not None:
        departments = [item for item in departments if item["active"] is active]
    return page_response(departments, page, limit)


@router.post("/departments", status_code=201)
def create_department(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_department(payload, actor)


@router.get("/departments/coordinator-summaries")
def list_department_coordinator_summaries(svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.department_summaries()


@router.get("/departments/{department_id}")
def get_department(department_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("departments", department_id)


@router.patch("/departments/{department_id}")
def update_department(
    department_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_record("departments", department_id, payload, actor)


@router.put("/departments/{department_id}/coordinator")
def assign_coordinator_to_department(
    department_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.assign_coordinator(department_id, payload, actor)


@router.get("/doctor-profiles")
def list_doctor_profiles(
    page: int = 1,
    limit: int = 25,
    department_id: str | None = None,
    active: bool | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    doctors = svc.list("doctor_profiles")
    if department_id:
        doctors = [item for item in doctors if item.get("departmentId") == department_id]
    if active is not None:
        doctors = [item for item in doctors if item["active"] is active]
    return page_response(doctors, page, limit)


@router.post("/doctor-profiles", status_code=201)
def create_doctor_profile(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_doctor_profile(payload, actor)


@router.get("/doctor-profiles/me/context")
def get_current_doctor_context(
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.current_doctor_context(actor)


@router.get("/doctor-profiles/{doctor_profile_id}")
def get_doctor_profile(doctor_profile_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("doctor_profiles", doctor_profile_id)


@router.patch("/doctor-profiles/{doctor_profile_id}")
def update_doctor_profile(
    doctor_profile_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_record("doctor_profiles", doctor_profile_id, payload, actor)


@router.get("/doctor-invitations")
def list_doctor_invitations(
    page: int = 1,
    limit: int = 25,
    department_id: str | None = None,
    status: str | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    invitations = svc.list("doctor_invitations")
    if department_id:
        invitations = [item for item in invitations if item["departmentId"] == department_id]
    if status:
        invitations = [item for item in invitations if item["status"] == status]
    return page_response(invitations, page, limit)


@router.post("/doctor-invitations", status_code=201)
def create_doctor_invitation(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_invitation(payload, actor)


@router.post("/doctor-invitations/{invitation_id}/resend")
def resend_doctor_invitation(invitation_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("doctor_invitations", invitation_id)


@router.post("/doctor-invitations/accept", status_code=201)
def accept_doctor_invitation(payload: dict[str, Any] = Body(...), svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.accept_invitation(payload)


@router.get("/preference-categories")
def list_preference_categories(svc: MvpService = Depends(service)) -> dict[str, Any]:
    return {"data": svc.list("preference_categories")}


@router.post("/preference-categories", status_code=201)
def create_preference_category(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_preference_category(payload, actor)


@router.get("/constraint-rules")
def list_constraint_rules(
    type: str | None = None,
    active: bool | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    rules = svc.list("constraint_rules")
    if type:
        rules = [item for item in rules if item["type"] == type]
    if active is not None:
        rules = [item for item in rules if item["active"] is active]
    return {"data": rules}


@router.get("/system-settings")
def get_system_settings(svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get_settings()


@router.put("/system-settings")
def save_system_settings(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.save_settings(payload, actor)


@router.get("/schedules")
def list_schedules(
    page: int = 1,
    limit: int = 25,
    department_id: str | None = Query(default=None, alias="departmentId"),
    status: str | None = None,
    period_from: str | None = Query(default=None, alias="periodFrom"),
    period_to: str | None = Query(default=None, alias="periodTo"),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    schedules = svc.list("schedules")
    if department_id:
        schedules = [item for item in schedules if item["departmentId"] == department_id]
    if status:
        schedules = [item for item in schedules if item["status"] == status]
    if period_from:
        schedules = [item for item in schedules if item["periodEnd"] >= period_from]
    if period_to:
        schedules = [item for item in schedules if item["periodStart"] <= period_to]
    return page_response(schedules, page, limit)


@router.post("/schedules", status_code=201)
def create_schedule(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_schedule(payload, actor)


@router.get("/schedules/current")
def get_current_schedule(
    department_id: str | None = Query(default=None, alias="departmentId"),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.current_schedule(department_id)


@router.get("/schedules/{schedule_id}")
def get_schedule(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("schedules", schedule_id)


@router.patch("/schedules/{schedule_id}")
def update_schedule_draft(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_schedule(schedule_id, payload, actor)


@router.get("/schedules/{schedule_id}/coordinator-dashboard")
def get_coordinator_dashboard_schedule(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.coordinator_dashboard(schedule_id)


@router.get("/schedules/{schedule_id}/doctor-dashboard")
def get_doctor_dashboard_data(
    schedule_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.doctor_dashboard(schedule_id, actor)


@router.get("/schedules/{schedule_id}/doctor-schedule")
def get_doctor_schedule(
    schedule_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.doctor_schedule(schedule_id, actor)


@router.get("/schedules/{schedule_id}/editor-view")
def get_schedule_editor_view(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.schedule_editor(schedule_id)


@router.get("/schedules/{schedule_id}/availability-collection-view")
def get_availability_collection(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.availability_collection(schedule_id)


@router.get("/schedules/{schedule_id}/participants")
def list_schedule_participants(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return {
        "data": [
            item
            for item in svc.list("schedule_participants")
            if item["scheduleId"] == schedule_id and item["status"] == "ACTIVE"
        ]
    }


@router.post("/schedules/{schedule_id}/participants", status_code=201)
def add_schedule_participant(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.add_participant(schedule_id, payload, actor)


@router.delete("/schedules/{schedule_id}/participants/{doctor_profile_id}", status_code=204)
def remove_schedule_participant(
    schedule_id: str,
    doctor_profile_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> Response:
    svc.remove_participant(schedule_id, doctor_profile_id, actor)
    return Response(status_code=204)


@router.get("/schedules/{schedule_id}/availability")
def list_schedule_availability(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return {"data": [item for item in svc.list("availability") if item["scheduleId"] == schedule_id]}


@router.get("/schedules/{schedule_id}/availability/me")
def get_my_availability(
    schedule_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.get_my_availability(schedule_id, actor)


@router.put("/schedules/{schedule_id}/availability/me")
def submit_my_availability(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.submit_availability(schedule_id, payload, actor)


@router.get("/schedules/{schedule_id}/availability/{doctor_profile_id}")
def get_doctor_availability_for_schedule(
    schedule_id: str,
    doctor_profile_id: str,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    declaration = svc.availability_for(schedule_id, doctor_profile_id)
    if declaration is None:
        return svc.get("availability", "missing")
    return declaration


@router.get("/schedules/{schedule_id}/shifts")
def list_schedule_shifts(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return {"data": [item for item in svc.list("shifts") if item["scheduleId"] == schedule_id]}


@router.post("/schedules/{schedule_id}/shifts", status_code=201)
def create_schedule_shift(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_shift(schedule_id, payload, actor)


@router.patch("/schedules/{schedule_id}/shifts/{shift_id}")
def update_schedule_shift(
    schedule_id: str,
    shift_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_shift(schedule_id, shift_id, payload, actor)


@router.get("/schedules/{schedule_id}/assignments")
def list_schedule_assignments(
    schedule_id: str,
    doctor_profile_id: str | None = Query(default=None, alias="doctorProfileId"),
    status: str | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    assignments = [item for item in svc.list("assignments") if item["scheduleId"] == schedule_id]
    if doctor_profile_id:
        assignments = [item for item in assignments if item["doctorProfileId"] == doctor_profile_id]
    if status:
        assignments = [item for item in assignments if item["status"] == status]
    return {"data": assignments}


@router.post("/schedules/{schedule_id}/assignments", status_code=201)
def create_manual_assignment(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_assignment(schedule_id, payload, actor)


@router.patch("/schedules/{schedule_id}/assignments/{assignment_id}")
def update_assignment(
    schedule_id: str,
    assignment_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.update_assignment(schedule_id, assignment_id, payload, actor)


@router.delete("/schedules/{schedule_id}/assignments/{assignment_id}", status_code=204)
def cancel_assignment(
    schedule_id: str,
    assignment_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> Response:
    svc.cancel_assignment(schedule_id, assignment_id, actor)
    return Response(status_code=204)


@router.post("/schedules/{schedule_id}/generate", status_code=202)
def generate_schedule(
    schedule_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.generate_schedule(schedule_id, payload or {}, actor)


@router.get("/generation-runs/{generation_run_id}")
def get_generation_run(generation_run_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("generation_runs", generation_run_id)


@router.get("/generation-runs/{generation_run_id}/conflict-report")
def get_generation_conflict_report(generation_run_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.conflict_report_for_run(generation_run_id)


@router.post("/schedules/{schedule_id}/validate")
def validate_schedule_or_change(
    schedule_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.validate_schedule(schedule_id, payload)


@router.post("/schedules/{schedule_id}/publish")
def publish_schedule(
    schedule_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.publish_schedule(schedule_id, payload or {}, actor)


@router.post("/schedules/{schedule_id}/archive")
def archive_schedule(
    schedule_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.archive_schedule(schedule_id, payload or {}, actor)


@router.get("/schedules/{schedule_id}/leave-requests")
def list_schedule_leave_requests(
    schedule_id: str,
    doctor_profile_id: str | None = Query(default=None, alias="doctorProfileId"),
    status: str | None = None,
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.leave_items(schedule_id, doctor_profile_id, status)


@router.post("/schedules/{schedule_id}/leave-requests", status_code=201)
def create_leave_request(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_leave(schedule_id, payload, actor)


@router.post("/leave-requests/{leave_request_id}/approve")
def approve_leave_request(
    leave_request_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.decide_leave(leave_request_id, "APPROVED", payload or {}, actor)


@router.post("/leave-requests/{leave_request_id}/reject")
def reject_leave_request(
    leave_request_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.decide_leave(leave_request_id, "REJECTED", payload or {}, actor)


@router.post("/leave-requests/{leave_request_id}/cancel")
def cancel_leave_request(
    leave_request_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.cancel_leave(leave_request_id, actor)


@router.get("/schedules/{schedule_id}/swap-requests")
def list_schedule_swap_requests(
    schedule_id: str,
    status: str | None = None,
    doctor_profile_id: str | None = Query(default=None, alias="doctorProfileId"),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    swaps = [item for item in svc.list("swap_requests") if item["scheduleId"] == schedule_id]
    if status:
        swaps = [item for item in swaps if item["status"] == status]
    if doctor_profile_id:
        swaps = [
            item
            for item in swaps
            if item["requestingDoctorId"] == doctor_profile_id
            or any(candidate["doctorProfileId"] == doctor_profile_id for candidate in item["candidates"])
        ]
    return {"data": swaps}


@router.post("/schedules/{schedule_id}/swap-requests", status_code=201)
def create_swap_request(
    schedule_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_swap(schedule_id, payload, actor)


@router.get("/schedules/{schedule_id}/swap-options")
def get_doctor_swap_options(
    schedule_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.swap_options(schedule_id, actor)


@router.get("/schedules/{schedule_id}/swap-approval-view")
def list_coordinator_swap_approvals(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.coordinator_swap_approvals(schedule_id)


@router.get("/swap-requests/{swap_request_id}")
def get_swap_request(swap_request_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.get("swap_requests", swap_request_id)


@router.get("/swap-requests/{swap_request_id}/doctor-approval-view")
def get_doctor_swap_approval(
    swap_request_id: str,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.doctor_swap_approval(swap_request_id, actor)


@router.post("/swap-requests/{swap_request_id}/respond")
def respond_to_swap_request(
    swap_request_id: str,
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.respond_swap(swap_request_id, payload, actor)


@router.post("/swap-requests/{swap_request_id}/validate")
def validate_swap_request(swap_request_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.validate_swap(swap_request_id)


@router.post("/swap-requests/{swap_request_id}/approve")
def approve_swap_request(
    swap_request_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.approve_swap(swap_request_id, payload or {}, actor)


@router.post("/swap-requests/{swap_request_id}/reject")
def reject_swap_request(
    swap_request_id: str,
    payload: dict[str, Any] | None = Body(default=None),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.reject_swap(swap_request_id, payload or {}, actor)


@router.get("/schedules/{schedule_id}/metrics")
def get_schedule_metrics(schedule_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.metrics(schedule_id)


@router.get("/notifications")
def list_my_notifications(
    page: int = 1,
    limit: int = 25,
    status: str | None = None,
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    notifications = [item for item in svc.list("notifications") if item["recipientUserId"] == actor["id"]]
    if status:
        notifications = [item for item in notifications if item["status"] == status]
    return page_response(notifications, page, limit)


@router.post("/notifications/{notification_id}/read")
def mark_notification_as_read(notification_id: str, svc: MvpService = Depends(service)) -> dict[str, Any]:
    return svc.mark_notification_read(notification_id)


@router.get("/calendar-exports")
def list_my_calendar_exports(
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    doctor = svc.doctor_for_user(actor["id"])
    return {"data": [item for item in svc.list("calendar_exports") if item["doctorProfileId"] == doctor["id"]]}


@router.post("/calendar-exports", status_code=201)
def create_calendar_export(
    payload: dict[str, Any] = Body(...),
    actor: dict[str, Any] = Depends(current_actor),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    return svc.create_calendar_export(payload, actor)


@router.delete("/calendar-exports/{calendar_export_id}", status_code=204)
def revoke_calendar_export(calendar_export_id: str, svc: MvpService = Depends(service)) -> Response:
    svc.revoke_calendar_export(calendar_export_id)
    return Response(status_code=204)


@router.get("/calendar-exports/{token}.ics", response_class=PlainTextResponse)
def download_ics_calendar(token: str, svc: MvpService = Depends(service)) -> str:
    return svc.ics_calendar(token)


@router.get("/audit-log")
def list_audit_log_entries(
    page: int = 1,
    limit: int = 25,
    entity_type: str | None = Query(default=None, alias="entityType"),
    entity_id: str | None = Query(default=None, alias="entityId"),
    actor_user_id: str | None = Query(default=None, alias="actorUserId"),
    svc: MvpService = Depends(service),
) -> dict[str, Any]:
    entries = svc.list("audit_log")
    if entity_type:
        entries = [item for item in entries if item["entityType"] == entity_type]
    if entity_id:
        entries = [item for item in entries if item["entityId"] == entity_id]
    if actor_user_id:
        entries = [item for item in entries if item["actorUserId"] == actor_user_id]
    entries = sorted(entries, key=lambda item: item["timestamp"], reverse=True)
    return page_response(entries, page, limit)
