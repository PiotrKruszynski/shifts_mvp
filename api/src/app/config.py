from __future__ import annotations

import os
from dataclasses import dataclass

DEFAULT_CORS_ALLOWED_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
)


@dataclass(frozen=True, slots=True)
class Settings:
    """Application settings loaded from environment variables."""

    app_name: str
    environment: str
    host: str
    port: int
    api_prefix: str
    cors_allowed_origins: tuple[str, ...]


def normalize_path_prefix(raw_value: str) -> str:
    """Normalize an optional URL path prefix."""
    prefix = raw_value.strip()
    if not prefix or prefix == "/":
        return ""
    if not prefix.startswith("/"):
        prefix = f"/{prefix}"
    return prefix.rstrip("/")


def parse_allowed_origins(raw_value: str | None) -> tuple[str, ...]:
    """Parse a comma-separated list of allowed CORS origins."""
    if raw_value is None:
        return DEFAULT_CORS_ALLOWED_ORIGINS

    origins = tuple(item.strip() for item in raw_value.split(",") if item.strip())
    return origins or DEFAULT_CORS_ALLOWED_ORIGINS


def load_settings() -> Settings:
    """Load application settings from the environment."""
    return Settings(
        app_name=os.getenv("APP_NAME", "Shifts MVP API"),
        environment=os.getenv("APP_ENV", "development"),
        host=os.getenv("APP_HOST", "127.0.0.1"),
        port=int(os.getenv("APP_PORT", "8000")),
        api_prefix=normalize_path_prefix(os.getenv("API_PREFIX", "/api/v1")),
        cors_allowed_origins=parse_allowed_origins(os.getenv("CORS_ALLOWED_ORIGINS")),
    )
