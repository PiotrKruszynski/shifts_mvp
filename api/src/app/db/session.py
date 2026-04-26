from __future__ import annotations

import json
import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from typing import Any

SCHEMA = """
CREATE TABLE IF NOT EXISTS records (
    kind TEXT NOT NULL,
    id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (kind, id)
);
CREATE INDEX IF NOT EXISTS idx_records_kind ON records(kind);
"""


def connect(database_path: Path) -> sqlite3.Connection:
    """Open a SQLite connection with JSON-friendly row access."""
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database(database_path: Path) -> None:
    """Create required tables if they do not exist."""
    connection = connect(database_path)
    try:
        connection.executescript(SCHEMA)
        connection.commit()
    finally:
        connection.close()


@contextmanager
def database_connection(database_path: Path) -> Iterator[sqlite3.Connection]:
    """Yield a transaction-scoped SQLite connection."""
    connection = connect(database_path)
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def encode_record(data: dict[str, Any]) -> str:
    """Serialize a record deterministically for SQLite storage."""
    return json.dumps(data, ensure_ascii=True, sort_keys=True, separators=(",", ":"))


def decode_record(raw: str) -> dict[str, Any]:
    """Deserialize a stored JSON record."""
    value = json.loads(raw)
    if not isinstance(value, dict):
        msg = "Stored record is not a JSON object"
        raise TypeError(msg)
    return value
