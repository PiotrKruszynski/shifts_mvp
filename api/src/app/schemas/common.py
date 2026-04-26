from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FlexibleModel(BaseModel):
    """Pydantic model for contract payloads persisted as typed JSON objects."""

    model_config = ConfigDict(extra="allow")


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: list[dict[str, Any]] = Field(default_factory=list)


class Payload(FlexibleModel):
    """Generic request payload used by thin contract routes."""
