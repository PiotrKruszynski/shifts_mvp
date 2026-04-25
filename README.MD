# Shifts MVP

System SaaS do planowania dyżurów medycznych zgodny z polskim prawem pracy.

## O projekcie

Shifts MVP automatyzuje planowanie 24-godzinnych dyżurów lekarskich, eliminując błędy arkuszy kalkulacyjnych i zapewniając zgodność z Kodeksem Pracy oraz Ustawą o działalności leczniczej.

**Kluczowe funkcje:**
- Automatyczne generowanie grafików z walidacją limitów czasu pracy
- Deklarowanie dostępności i preferencji przez lekarzy
- System zamian dyżurów po publikacji grafiku
- Powiadomienia e-mail/push i synchronizacja z kalendarzami
- Pełna ścieżka audytu

## Role użytkowników

| Rola | Uprawnienia |
|------|-------------|
| **Lekarz** | Dostępność, preferencje, urlopy, zamiany dyżurów |
| **Koordynator** | Tworzenie grafików, generowanie, publikacja, zatwierdzanie zamian |
| **Admin** | Zarządzanie użytkownikami, konfiguracja systemu |

## Cykl życia grafiku

```
DRAFT → GENERATED → PUBLISHED → ARCHIVED
```

## Stack technologiczny

| Warstwa | Technologia |
|---------|-------------|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy, SQLite |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Auth** | JWT Bearer tokens |
| **API** | REST (OpenAPI 3.1) |

## Struktura projektu

```
shifts_mvp/
├── api/                    # Backend FastAPI
├── docs/
│   ├── adr/                # Architecture Decision Records
│   ├── architecture/       # Dokumenty architektury i kontrakty API
│   └── execution_plans/    # Plany wykonawcze
├── pwa/                    # Frontend React PWA
└── README.MD
```

## Instalacja

### Wymagania
- Python 3.12+
- uv
- Node.js 20+

### Backend

```bash
cd api
uv sync
cp .env.example .env
uv run alembic upgrade head
uv run uvicorn main:app --reload
```

### Frontend

```bash
cd pwa
npm install
npm run dev
```

## Dokumentacja

- [Założenia projektowe](docs/architecture/project_asumptions.md)
- [Model domeny](docs/architecture/domain_model.md)
- [Diagram ER](docs/architecture/er_diagram.md)
- [OpenAPI Spec](docs/architecture/openapi.yaml)
