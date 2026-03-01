# 04 Solution Strategy

## Core Strategy

1. Build a modular monolith first for speed, consistency, and simpler operations.
2. Use contract-first JSON schema for analysis outputs.
3. Enforce schema validation before persistence.
4. Apply bounded repair loop for invalid model output (max 2 retries).
5. Persist immutable run records and full traceability fields.

## Reliability and Traceability

Each analysis run stores at minimum:

- `prompt_version`
- `model_id`
- `run_status`
- `validation_status`
- `error_code` (when failed)

No silent fallback heuristics are allowed.
