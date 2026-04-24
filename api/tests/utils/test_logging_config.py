from __future__ import annotations

from typing import TYPE_CHECKING

from app.utils.logging_config import build_logging_config

if TYPE_CHECKING:
    from pathlib import Path


def test_build_logging_config_uses_console_only_by_default() -> None:
    """Ensure default logging goes only to stdout."""
    config = build_logging_config(level="info")

    assert config["root"] == {"handlers": ["console"], "level": "INFO"}
    assert set(config["handlers"]) == {"console"}


def test_build_logging_config_adds_file_handler_when_path_is_set(tmp_path: Path) -> None:
    """Ensure file logging is enabled only when requested."""
    log_file = tmp_path / "logs" / "api.log"

    config = build_logging_config(level="debug", log_file_path=str(log_file))

    handlers = config["handlers"]

    assert log_file.parent.exists()
    assert config["root"] == {"handlers": ["console", "file"], "level": "DEBUG"}
    assert handlers["file"]["filename"] == str(log_file)
    assert handlers["file"]["level"] == "DEBUG"
