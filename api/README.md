# Shifts MVP API

Backend `FastAPI` dla aplikacji Shifts MVP do planowania 24-godzinnych dyżurów lekarskich.

## Wymagania

- Python 3.14
- uv

## Instalacja

```bash
uv sync --python 3.14 --dev
```

## Uruchamianie

```bash
uv run api
```

Alternatywnie:

```bash
uv run app
uv run python -m app
```

Po starcie API jest domyślnie dostępne pod `http://127.0.0.1:8000`, a dokumentacja pod `http://127.0.0.1:8000/api/v1/docs`.

## Sprawdzanie

```bash
uv run pytest
uv run ruff check .
uv run ty check
```

## Pre-commit

```bash
uv run pre-commit install --config .pre-commit-config.yaml --hook-type pre-commit --hook-type pre-push --hook-type commit-msg
uv run pre-commit run --config .pre-commit-config.yaml --all-files
```

## Endpointy startowe

- `GET /` - metadane usługi
- `GET /api/v1/health` - healthcheck
- `GET /api/v1/docs` - Swagger UI

## Zmienne środowiskowe

- `APP_NAME` - nazwa usługi widoczna w logach i odpowiedziach API
- `APP_ENV` - środowisko uruchomieniowe, np. `development`, `test`, `production`
- `APP_HOST` - host serwera, domyślnie `127.0.0.1`
- `APP_PORT` - port serwera, domyślnie `8000`
- `API_PREFIX` - prefiks endpointów API, domyślnie `/api/v1`
- `CORS_ALLOWED_ORIGINS` - lista originów PWA rozdzielona przecinkami
- `LOG_LEVEL` - poziom logowania, domyślnie `INFO`
- `LOG_FILE_PATH` - jeśli ustawione, logi będą zapisywane także do wskazanego pliku

## Struktura

- `src/app/main.py` - fabryka aplikacji `FastAPI` i uruchamianie serwera
- `src/app/config.py` - ładowanie konfiguracji środowiskowej
- `src/app/api/routes/health.py` - podstawowy endpoint zdrowia
- `src/app/utils/logging_config.py` - konfiguracja logowania
- `tests/` - testy endpointów i warstwy pomocniczej
