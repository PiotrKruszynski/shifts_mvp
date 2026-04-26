from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.db.session import database_connection, decode_record, encode_record

RecordList = list[dict[str, Any]]


def utc_now() -> str:
    """Return an API timestamp."""
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class RecordStore:
    """Small SQLite-backed repository for MVP contract records."""

    def __init__(self, database_path: Path) -> None:
        self.database_path = database_path

    def list(self, kind: str) -> RecordList:
        with database_connection(self.database_path) as connection:
            rows = connection.execute(
                "SELECT data FROM records WHERE kind = ? ORDER BY created_at, id",
                (kind,),
            ).fetchall()
        return [decode_record(row["data"]) for row in rows]

    def get(self, kind: str, record_id: str) -> dict[str, Any] | None:
        with database_connection(self.database_path) as connection:
            row = connection.execute(
                "SELECT data FROM records WHERE kind = ? AND id = ?",
                (kind, record_id),
            ).fetchone()
        return None if row is None else decode_record(row["data"])

    def require(self, kind: str, record_id: str) -> dict[str, Any]:
        record = self.get(kind, record_id)
        if record is None:
            raise KeyError(f"{kind}:{record_id}")
        return record

    def save(self, kind: str, data: dict[str, Any]) -> dict[str, Any]:
        record_id = str(data["id"])
        now = utc_now()
        existing = self.get(kind, record_id)
        created_at = existing.get("_storedCreatedAt", now) if existing else now
        stored = {**data, "_storedCreatedAt": created_at, "_storedUpdatedAt": now}
        with database_connection(self.database_path) as connection:
            connection.execute(
                """
                INSERT INTO records(kind, id, data, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(kind, id) DO UPDATE SET
                    data = excluded.data,
                    updated_at = excluded.updated_at
                """,
                (kind, record_id, encode_record(stored), created_at, now),
            )
        return self.public(stored)

    def delete(self, kind: str, record_id: str) -> None:
        with database_connection(self.database_path) as connection:
            connection.execute("DELETE FROM records WHERE kind = ? AND id = ?", (kind, record_id))

    def clear(self) -> None:
        with database_connection(self.database_path) as connection:
            connection.execute("DELETE FROM records")

    def public(self, data: dict[str, Any]) -> dict[str, Any]:
        return {key: value for key, value in data.items() if not key.startswith("_")}

    def list_public(self, kind: str) -> RecordList:
        return [self.public(item) for item in self.list(kind)]
