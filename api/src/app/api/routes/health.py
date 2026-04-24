from __future__ import annotations

from typing import TYPE_CHECKING, cast

from fastapi import APIRouter, Request

if TYPE_CHECKING:
    from app.config import Settings

router = APIRouter(tags=["health"])


@router.get("/health")
def read_health(request: Request) -> dict[str, str]:
    """Return a lightweight health payload for probes and the PWA."""
    settings = cast("Settings", request.app.state.settings)
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
    }
