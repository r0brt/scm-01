# 02 Architecture Constraints

## Technical Constraints

- Backend stack: Python + FastAPI.
- Persistence baseline: SQLAlchemy 2 + Alembic + PostgreSQL.
- Frontend baseline: React + Vite + TypeScript.
- Python tooling: `uv`; frontend tooling: `npm`.

## Process Constraints

- Contract-first development for analysis payloads.
- Docs-as-code with arc42 + ADR updates for architecture-impacting changes.
- Mandatory tests and reproducible commands for each milestone.

## Organizational Constraints

- Solo project workflow with short-lived branches.
- Small scoped changes preferred over large batches.
