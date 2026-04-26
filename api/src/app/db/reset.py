from __future__ import annotations

from pathlib import Path

from app.db.seed import seed_database


def reset_database(database_path: Path) -> None:
    """Reset the SQLite database to the deterministic seed state."""
    if database_path.exists():
        database_path.unlink()
    seed_database(database_path)
