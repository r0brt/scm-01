# arc42 Architekturdokumentation

Dieser Ordner enthält die Architekturdokumentation im arc42-Format.

## Inhaltsverzeichnis

1. [Einführung und Ziele](01_einfuehrung_und_ziele.md)
2. [Randbedingungen](02_randbedingungen.md)
3. [Systemkontext und -abgrenzung](03_systemkontext_und_abgrenzung.md)
4. [Lösungsstrategie](04_loesungsstrategie.md)
5. [Bausteinsicht](05_bausteinsicht.md)
6. [Laufzeitsicht](06_laufzeitsicht.md)
7. [Verteilungssicht](07_verteilungssicht.md)
8. [Querschnittliche Konzepte](08_querschnittliche_konzepte.md)
9. [Architekturentscheidungen](09_architekturentscheidungen.md)
10. [Qualitätsszenarien](10_qualitaetsszenarien.md)
11. [Technische Risiken](11_technische_risiken.md)
12. [Glossar](12_glossar.md)

## Pflegehinweise

- Kapitel prägnant halten und nur betroffene Kapitel aktualisieren.
- Entscheidungen als ADRs in `docs/adr/` referenzieren.
- Konsistenz mit `docs/prd.md`, `PLAN.md` und Implementierung sicherstellen.
- Datenschutz-, Nachvollziehbarkeits- und AI-Governance-Details bei Bedarf mit `docs/privacy-and-ai-governance.md` abgleichen; arc42 bleibt dabei das Primärdokument, das Zusatzdokument ist ein unterstützendes Artefakt.

## arc42 Update Trigger

Aktualisiere relevante Kapitel, wenn sich einer der folgenden Punkte ändert:

- API-Oberfläche (OpenAPI, Endpunkte, Fehlervertrag)
- Datenmodell, Persistenz, Migrationen oder DB-Technologie
- Laufzeit-/Deployment-Topologie (Compose, Container, Umgebungsvariablen)
- LLM-Integrationsverhalten (Adapter, Prompt-Versionierung, Reliability Guardrails)
- Querschnittsthemen (Logging, Correlation IDs, Validierung/Repair, Sicherheitsannahmen)
