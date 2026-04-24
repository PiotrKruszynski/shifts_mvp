from __future__ import annotations

from typing import TYPE_CHECKING

from app.config import (
    DEFAULT_CORS_ALLOWED_ORIGINS,
    load_settings,
    normalize_path_prefix,
    parse_allowed_origins,
)

if TYPE_CHECKING:
    import pytest


def test_normalize_path_prefix_handles_common_variants() -> None:
    """Ensure API prefixes are normalized consistently."""
    assert normalize_path_prefix("/api/v1/") == "/api/v1"
    assert normalize_path_prefix("api/v1") == "/api/v1"
    assert normalize_path_prefix("/") == ""
    assert normalize_path_prefix("   ") == ""


def test_parse_allowed_origins_handles_common_inputs() -> None:
    """Ensure CORS origins can be read from environment variables."""
    assert parse_allowed_origins(None) == DEFAULT_CORS_ALLOWED_ORIGINS
    assert parse_allowed_origins("*") == ("*",)
    assert parse_allowed_origins("http://localhost:5173, https://example.com ") == (
        "http://localhost:5173",
        "https://example.com",
    )
    assert parse_allowed_origins(" , ") == DEFAULT_CORS_ALLOWED_ORIGINS


def test_load_settings_reads_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ensure environment variables map cleanly into application settings."""
    monkeypatch.setenv("APP_NAME", "Shifts MVP API")
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("APP_HOST", "127.0.0.1")
    monkeypatch.setenv("APP_PORT", "9001")
    monkeypatch.setenv("API_PREFIX", "api/internal")
    monkeypatch.setenv("CORS_ALLOWED_ORIGINS", "https://pwa.example.com, https://admin.example.com")

    settings = load_settings()

    assert settings.app_name == "Shifts MVP API"
    assert settings.environment == "production"
    assert settings.host == "127.0.0.1"
    assert settings.port == 9001
    assert settings.api_prefix == "/api/internal"
    assert settings.cors_allowed_origins == (
        "https://pwa.example.com",
        "https://admin.example.com",
    )
