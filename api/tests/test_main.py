from __future__ import annotations

import runpy
from typing import TYPE_CHECKING

from fastapi.testclient import TestClient

import app.main as app_main
from app.config import Settings
from app.utils import logging_config

if TYPE_CHECKING:
    from pathlib import Path

    import pytest
    from pytest_mock import MockerFixture


def test_create_app_exposes_root_and_healthcheck() -> None:
    """Ensure the API exposes metadata and a health endpoint."""
    settings = Settings(
        app_name="Shifts MVP API",
        environment="test",
        host="127.0.0.1",
        port=9000,
        api_prefix="/api/v1",
        cors_allowed_origins=("http://localhost:5173",),
    )

    with TestClient(app_main.create_app(settings)) as client:
        root_response = client.get("/")
        health_response = client.get("/api/v1/health")

    assert root_response.status_code == 200
    assert root_response.json() == {
        "service": "Shifts MVP API",
        "api_prefix": "/api/v1",
        "health": "/api/v1/health",
        "docs": "/api/v1/docs",
    }
    assert health_response.status_code == 200
    assert health_response.json() == {
        "status": "ok",
        "service": "Shifts MVP API",
        "environment": "test",
    }


def test_create_app_reads_settings_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ensure the default app factory respects environment configuration."""
    monkeypatch.setenv("APP_NAME", "API test")
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("API_PREFIX", "/")
    monkeypatch.delenv("CORS_ALLOWED_ORIGINS", raising=False)

    with TestClient(app_main.create_app()) as client:
        health_response = client.get("/health")

    assert health_response.status_code == 200
    assert health_response.json() == {
        "status": "ok",
        "service": "API test",
        "environment": "test",
    }


def test_create_app_allows_preflight_from_configured_pwa_origin() -> None:
    """Ensure the API is ready for a sibling PWA during local development."""
    settings = Settings(
        app_name="Shifts MVP API",
        environment="test",
        host="127.0.0.1",
        port=9000,
        api_prefix="/api/v1",
        cors_allowed_origins=("http://localhost:5173",),
    )

    with TestClient(app_main.create_app(settings)) as client:
        response = client.options(
            "/api/v1/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_python_m_app_runs_main(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ensure ``python -m app`` delegates to the main entry point."""
    called = False

    def fake_main() -> None:
        nonlocal called
        called = True

    monkeypatch.setattr(app_main, "main", fake_main)

    runpy.run_module("app", run_name="__main__")

    assert called


def test_main_runs_uvicorn_with_loaded_settings(mocker: MockerFixture) -> None:
    """Ensure the CLI entry point starts the configured API server."""
    settings = Settings(
        app_name="Shifts MVP API",
        environment="development",
        host="127.0.0.1",
        port=9000,
        api_prefix="/api/v1",
        cors_allowed_origins=("http://localhost:5173",),
    )
    load_settings = mocker.patch.object(app_main, "load_settings", return_value=settings)
    configure_logging = mocker.patch.object(app_main, "configure_logging")
    uvicorn_run = mocker.patch.object(app_main.uvicorn, "run")

    app_main.main()

    load_settings.assert_called_once_with()
    configure_logging.assert_called_once_with()
    uvicorn_run.assert_called_once_with(
        "app.main:create_app",
        host="127.0.0.1",
        port=9000,
        factory=True,
        reload=False,
    )


def test_configure_logging_reads_environment(
    monkeypatch: pytest.MonkeyPatch, mocker: MockerFixture, tmp_path: Path
) -> None:
    """Ensure environment variables are passed into dictConfig."""
    log_file = tmp_path / "logs" / "service.log"
    monkeypatch.setenv("LOG_LEVEL", "warning")
    monkeypatch.setenv("LOG_FILE_PATH", str(log_file))
    dict_config = mocker.patch.object(logging_config.logging.config, "dictConfig")

    logging_config.configure_logging()

    config = dict_config.call_args.args[0]

    assert config["root"] == {"handlers": ["console", "file"], "level": "WARNING"}
    assert config["handlers"]["file"]["filename"] == str(log_file)
