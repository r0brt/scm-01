# 05 Building Block View

## Level 1 Decomposition

- `Frontend UI` (planned): user input, result visualization, run history access.
- `Backend API` (planned): orchestration, validation, persistence, retrieval endpoints.
- `PostgreSQL` (planned): analysis runs and metadata storage.
- `LLM Provider` (external): text analysis generation via adapter integration.

## Responsibilities (Concept)

- UI handles presentation and user interactions.
- API enforces contracts, orchestrates workflow, and maps errors.
- DB ensures durable, queryable run history.
- LLM provider supplies generated analysis content under strict contract checks.
