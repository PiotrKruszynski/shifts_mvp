from __future__ import annotations

from app.config import load_settings
from app.db.reset import reset_database
from app.db.seed import seed_database


def seed() -> None:
    """Seed the configured SQLite database."""
    seed_database(load_settings().database_path)


def reset() -> None:
    """Reset the configured SQLite database."""
    reset_database(load_settings().database_path)
