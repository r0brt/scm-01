# arc42 Architecture Documentation

This folder contains the architecture documentation following arc42.

## Table of Contents

1. [Introduction and Goals](01_introduction_and_goals.md)
2. [Architecture Constraints](02_architecture_constraints.md)
3. [System Scope and Context](03_system_scope_and_context.md)
4. [Solution Strategy](04_solution_strategy.md)
5. [Building Block View](05_building_block_view.md)
6. [Runtime View](06_runtime_view.md)
7. [Deployment View](07_deployment_view.md)
8. [Cross-cutting Concepts](08_concepts.md)
9. [Architecture Decisions](09_architecture_decisions.md)
10. [Quality Scenarios](10_quality_scenarios.md)
11. [Technical Risks](11_technical_risks.md)
12. [Glossary](12_glossary.md)

## How to Maintain

- Keep each chapter concise and update only chapters affected by a change.
- Link decisions to ADRs in `docs/adr/`.
- Ensure architecture docs stay consistent with `docs/prd.md`, `PLAN.md`, and implementation.

## arc42 Update Triggers

Update relevant chapters when one of the following changes:

- API surface (OpenAPI, endpoints, error contract)
- Data model, persistence, migrations, or DB technology
- Runtime/deployment topology (compose, containers, environment variables)
- LLM integration behavior (adapter, prompt versioning, reliability guardrails)
- Cross-cutting concerns (logging, correlation IDs, validation/repair, security assumptions)
