from __future__ import annotations

import logging
import logging.config
import os
from pathlib import Path

from pythonjsonlogger import json


def build_logging_config(*, level: str, log_file_path: str | None = None) -> dict[str, object]:
    """Build logging config with console output and optional file logging."""
    normalized_level = level.upper()
    handlers: dict[str, dict[str, object]] = {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "level": normalized_level,
            "stream": "ext://sys.stdout",
        }
    }
    root_handlers = ["console"]

    if log_file_path:
        target_path = Path(log_file_path).expanduser()
        target_path.parent.mkdir(parents=True, exist_ok=True)
        handlers["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "json",
            "level": normalized_level,
            "filename": str(target_path),
            "maxBytes": 10_485_760,
            "backupCount": 5,
            "encoding": "utf-8",
        }
        root_handlers.append("file")

    formatters = {
        "json": {"()": json.JsonFormatter, "format": "%(asctime)s %(name)s %(levelname)s %(message)s %(module)s"}
    }

    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": formatters,
        "handlers": handlers,
        "root": {"handlers": root_handlers, "level": normalized_level},
    }


def configure_logging() -> None:
    """Configure application logging from environment variables."""
    level = os.getenv("LOG_LEVEL", "INFO")
    log_file_path = os.getenv("LOG_FILE_PATH")
    logging.config.dictConfig(build_logging_config(level=level, log_file_path=log_file_path))
