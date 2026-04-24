from __future__ import annotations

import re
import sys
from pathlib import Path

ALLOWED_TYPES = (
    "build",
    "chore",
    "ci",
    "docs",
    "feat",
    "fix",
    "perf",
    "refactor",
    "revert",
    "style",
    "test",
)

COMMIT_PATTERN = re.compile(
    rf"^({'|'.join(ALLOWED_TYPES)})(\([a-z0-9._-]+\))?!?: .{{1,100}}$"
)

IGNORED_PREFIXES = (
    "Merge ",
    "Revert ",
    "fixup! ",
    "squash! ",
)


def main() -> int:
    if len(sys.argv) < 2:
        print("Missing commit message file path.", file=sys.stderr)
        return 1

    commit_message_path = Path(sys.argv[1])
    subject = commit_message_path.read_text(encoding="utf-8").splitlines()[0].strip()

    if not subject:
        print("Commit message subject cannot be empty.", file=sys.stderr)
        return 1

    if subject.startswith(IGNORED_PREFIXES):
        return 0

    if COMMIT_PATTERN.match(subject):
        return 0

    allowed_types = ", ".join(ALLOWED_TYPES)
    print(
        "Invalid commit message. Use Conventional Commits format:\n"
        "  <type>(optional-scope): <description>\n"
        "  feat(api): add health endpoint\n"
        "  fix: handle empty CORS origins\n"
        f"Allowed types: {allowed_types}",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
