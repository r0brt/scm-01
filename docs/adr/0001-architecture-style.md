# ADR-0001: Architecture Style

## Status

Accepted

## Date

2026-03-01

## Decision

Use a modular monolith as the initial architecture style, with clear internal module boundaries and explicit contracts to enable optional future extraction.

## Context

The project starts as a solo implementation with strict reproducibility, contract validation, and documentation requirements. Early delivery needs low operational complexity while preserving a path to evolve deployment boundaries later.

## Consequences

Positive:

- Faster implementation and testing with fewer distributed-system concerns.
- Simpler local setup and debugging for milestone-driven delivery.
- Stronger consistency for contract-first validation and persistence logic.

Negative:

- Service-level independent scaling is deferred.
- Module boundaries must be actively maintained to avoid tight coupling.

## Alternatives Considered

- Microservices from day one.
- Layered monolith without explicit module boundaries.

## Why Microservices Are Not Chosen Initially

Microservices add operational overhead (network boundaries, deployment orchestration, distributed observability, failure modes) that is not justified at current project size and team capacity (solo). The immediate priority is correctness, reproducibility, and contract reliability, which can be achieved more effectively with a modular monolith baseline.
