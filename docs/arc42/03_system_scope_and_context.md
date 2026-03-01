# 03 System Scope and Context

## System Scope

The system accepts user-provided social media text, executes a structured analysis workflow, validates contract compliance, and stores/retrieves analysis runs.

## Context Diagram (Textual)

- Actor `User` interacts with the `Frontend UI` to submit text and review runs.
- `Frontend UI` calls the `Backend API` via HTTP/JSON.
- `Backend API` persists run data and metadata in `PostgreSQL`.
- `Backend API` calls an external `LLM Provider API` through an internal adapter.
- `LLM Provider API` is outside system control and treated as an external dependency.

## External Interfaces (Concept Level)

- UI to API: REST endpoints over JSON.
- API to DB: ORM + SQL migrations.
- API to LLM Provider: provider SDK/HTTP behind adapter port.
