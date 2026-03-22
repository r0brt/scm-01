# 11 Technische Risiken

## R1: Stub-Adapter statt echter Provider-Integration

- Risiko: Die aktuelle OpenAI-Implementierung ist noch ein Platzhalter; reale Provider-Effekte wie Formatdrift, Latenz und Kosten sind noch nicht praktisch verifiziert.
- Auswirkung: Das System ist fuer MVP-Demonstration und lokale Nachweise geeignet, aber noch kein produktionsnaher LLM-Betrieb.
- Gegenmassnahme: Adapter-Port, strikter JSON-Contract, persistierte Traceability-Felder und Offline-Tests ohne Netz.

## R2: Begrenzte E2E-Abdeckung

- Risiko: Der Browser-Nachweis deckt bewusst nur UJ1 als kritischen Happy Path ab.
- Auswirkung: Fehler in alternativen UI-Pfaden oder in zusammengesetzten Randfaellen koennen spaet entdeckt werden.
- Gegenmassnahme: Unit-, API-, Persistenz- und Integrationstests tragen den Hauptteil der Abdeckung; E2E bleibt minimal und stabil.

## R3: Unterschied zwischen lokalem Compose-Betrieb und spaeterem Produktivbetrieb

- Risiko: Compose verifiziert den lokalen Zielbetrieb, aber nicht produktionsnahe Themen wie TLS, Secret-Management, Observability oder externe Reverse-Proxies.
- Auswirkung: Ein spaeterer Deployment-Schritt kann weitere Infrastrukturarbeit erfordern.
- Gegenmassnahme: Konfiguration bereits ueber Umgebungsvariablen, klare Container-Schnitte (`frontend`, `api`, `db`) und dokumentierte Betriebsbefehle.

## R4: Sprach- und Analysequalitaet bleibt modellabhaengig

- Risiko: Die fachliche Qualitaet der sechs Analyseebenen haengt langfristig vom verwendeten Modell und Prompt ab.
- Auswirkung: Vertragstreue ist abgesichert, semantische Qualitaet jedoch nur begrenzt.
- Gegenmassnahme: Prompt-Versionierung, `model_id`-Persistenz, Validation-/Repair-Mechanik und explizite Fehlersemantik statt stiller Fallbacks.

## R5: Testkonfigurationsdrift zwischen Unit- und E2E-Tooling

- Risiko: Frontend-Unit- und E2E-Tests verwenden unterschiedliche Runner; ohne saubere Abgrenzung koennen sich Testdateien gegenseitig stoeren.
- Auswirkung: Finale Verifikation oder CI-Laeufe koennen an Tooling-Konflikten scheitern.
- Gegenmassnahme: Vitest schliesst `frontend/e2e/` explizit aus, Playwright bleibt ueber `npm run test:e2e` getrennt.
