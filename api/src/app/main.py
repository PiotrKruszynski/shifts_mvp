from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import TYPE_CHECKING

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware import Middleware

from app.api.router import api_router
from app.config import Settings, load_settings
from app.db.seed import ensure_seeded
from app.utils.logging_config import configure_logging

if TYPE_CHECKING:
    from collections.abc import AsyncIterator

logger = logging.getLogger(__name__)


def _with_prefix(prefix: str, path: str) -> str:
    """Join an API prefix with a route path."""
    return f"{prefix}{path}" if prefix else path


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create and configure the FastAPI application."""
    current_settings = settings or load_settings()
    docs_url = _with_prefix(current_settings.api_prefix, "/docs")
    openapi_url = _with_prefix(current_settings.api_prefix, "/openapi.json")
    redoc_url = _with_prefix(current_settings.api_prefix, "/redoc")

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        configure_logging()
        ensure_seeded(current_settings.database_path)
        logger.info(
            "API startup complete",
            extra={
                "app_name": current_settings.app_name,
                "environment": current_settings.environment,
                "api_prefix": current_settings.api_prefix or "/",
                "database_path": str(current_settings.database_path),
            },
        )
        yield
        logger.info("API shutdown complete", extra={"app_name": current_settings.app_name})

    allow_all_origins = current_settings.cors_allowed_origins == ("*",)
    middleware = [
        Middleware(
            CORSMiddleware,  # ty: ignore[invalid-argument-type]
            allow_origins=["*"] if allow_all_origins else list(current_settings.cors_allowed_origins),
            allow_credentials=not allow_all_origins,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ]

    app = FastAPI(
        title=current_settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
        docs_url=docs_url,
        openapi_url=openapi_url,
        redoc_url=redoc_url,
        middleware=middleware,
    )
    app.state.settings = current_settings
    app.include_router(api_router, prefix=current_settings.api_prefix)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        if isinstance(exc.detail, dict):
            return JSONResponse(status_code=exc.status_code, content=exc.detail, headers=exc.headers)
        return JSONResponse(
            status_code=exc.status_code,
            content={"code": "HTTP_ERROR", "message": str(exc.detail), "details": []},
            headers=exc.headers,
        )

    @app.get("/", tags=["meta"])
    def read_service_index() -> dict[str, str]:
        """Expose basic service metadata at the root URL."""
        return {
            "service": current_settings.app_name,
            "api_prefix": current_settings.api_prefix or "/",
            "health": _with_prefix(current_settings.api_prefix, "/health"),
            "docs": docs_url,
        }

    return app


app = create_app()


def main() -> None:
    """Run the API server using the current environment configuration."""
    settings = load_settings()
    configure_logging()
    logger.info(
        "Starting API server",
        extra={
            "app_name": settings.app_name,
            "host": settings.host,
            "port": settings.port,
            "api_prefix": settings.api_prefix or "/",
        },
    )
    uvicorn.run("app.main:create_app", host=settings.host, port=settings.port, factory=True, reload=False)


if __name__ == "__main__":  # pragma: no cover
    main()
