# 04 Lösungsstrategie

## Kernstrategie

1. Zuerst ein modularer Monolith für schnelle, konsistente und betrieblich einfache Umsetzung.
2. Contract-First-JSON-Schema für Analyseausgaben.
3. Schema-Validierung strikt vor Persistenz.
4. Begrenzter Repair-Loop bei ungültigen Modellausgaben (max. 2 Retries).
5. Unveränderliche Run-Datensätze mit vollständiger Traceability persistieren.

## Reliability und Traceability

Jeder Analyse-Run speichert mindestens:

- `prompt_version`
- `model_id`
- `run_status`
- `validation_status`
- `error_code` (bei Fehlschlag)

Stille Fallback-Heuristiken sind nicht erlaubt.
