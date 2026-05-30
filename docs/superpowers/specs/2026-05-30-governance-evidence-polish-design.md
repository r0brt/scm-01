# Governance Evidence Polish Design

## Ziel

Dieser Doku-PR schärft die vorhandenen Datenschutz-, KI-Governance-, Nachvollziehbarkeits- und Nachweisstellen, ohne Code, Laufzeitverhalten, Diagramme oder PDF-Layout zu ändern.

Das Ziel ist eine klarere Abgabedokumentation: Lesende sollen schnell verstehen, welche Nachweise existieren, welche Daten verarbeitet werden, wie Runs nachvollziehbar bleiben und welche MVP-Grenzen bewusst offengelegt sind.

## Scope

In Scope:

- `README.md`: kompakte Navigation zu Abgabe- und Nachweisdokumenten ergänzen.
- `docs/privacy-and-ai-governance.md`: Datenfluss, menschliche Verantwortung, AI-Act-Einordnung und MVP-Grenzen leicht präzisieren.
- `docs/arc42/08_querschnittliche_konzepte.md`: Governance- und Traceability-Aussagen mit dem Zusatzdokument konsistent halten.
- `docs/acceptance-checklist.md`: Abnahmepunkte klarer mit Testreport, CI, Compose und Governance-Dokumentation verknüpfen.
- `docs/test-report.md`: Nachweise besser einordnen, ohne neue Testergebnisse zu behaupten.

Out of Scope:

- Kein Code.
- Keine UI-Änderung.
- Keine Diagrammkorrektur.
- Kein PDF-Layout oder Export-Script.
- Keine Reflexion.
- Keine neuen oder erneut ausgeführten Tests als Ergebnisbehauptung, ausser den Doku-Prüfungen dieses PRs.

## Design

Der PR bleibt ein reiner Dokumentations-Polish. Die Architektur bleibt unverändert; die Doku wird als Nachweisnetz verdichtet:

- `README.md` wird zum Einstiegspunkt für Abgabe- und Nachweisnavigation.
- `docs/privacy-and-ai-governance.md` bleibt das vertiefende Governance-Artefakt.
- `docs/arc42/08_querschnittliche_konzepte.md` bleibt die primäre Arc42-Sicht auf Cross-Cutting Concepts und verweist auf das Governance-Artefakt.
- `docs/acceptance-checklist.md` bleibt die kompakte Abnahmesicht.
- `docs/test-report.md` bleibt die technische Evidenzliste mit bekannten Limitationen.

Damit entsteht keine neue Wahrheit neben der Architektur, sondern ein besser verlinktes Set bestehender Quellen.

## Inhaltliche Leitplanken

- Formulierungen müssen den aktuellen MVP ehrlich beschreiben.
- Datenschutz und AI Act werden als Architektur- und Governance-Einordnung beschrieben, nicht als formale Rechtsberatung oder vollständiger Compliance-Nachweis.
- Menschliche Letztverantwortung bleibt klar: SCM unterstützt Analyse und Strukturierung, trifft aber keine autonomen Sachentscheidungen.
- Nachvollziehbarkeit wird als Run-bezogene Traceability beschrieben, nicht als vollständige produktionsreife Observability.
- Bekannte Lücken werden als bewusste Grenzen sichtbar gemacht, ohne defensiv oder überdramatisch zu wirken.

## Erfolgskriterien

- README enthält eine schnelle Abgabe-/Nachweisnavigation.
- Governance-Dokument, Arc42-Kapitel 08, Abnahmecheckliste und Testreport widersprechen sich nicht.
- Die Doku unterscheidet klar zwischen implementiertem Nachweis, lokalem Testnachweis, CI-Nachweis und MVP-Grenze.
- Es werden keine neuen Test- oder Compliance-Ergebnisse behauptet, die nicht bereits dokumentiert sind.
- `git diff --check` ist sauber.

## Risiken

- Risiko: Doku wird zu juristisch oder klingt nach formaler Compliance-Zusage.
  - Mitigation: Formulierungen explizit als Architektur-/MVP-Einordnung halten.
- Risiko: Inhalte werden doppelt in Arc42 und Governance-Dokument wiederholt.
  - Mitigation: Arc42 kurz halten, Detailtiefe ins Governance-Dokument.
- Risiko: Testreport wirkt aktueller als er ist.
  - Mitigation: Bestehende Datums- und Commit-Bezüge erhalten und keine neuen Verifikationsresultate erfinden.
