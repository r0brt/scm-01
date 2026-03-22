# 11 Technische Risiken

## R1: Reale Provider-Integration bringt externe Laufzeitrisiken mit

- Risiko: Der OpenAI-Pfad haengt von externer Verfuegbarkeit, Latenz, Rate Limits und gueltiger API-Konfiguration ab.
- Auswirkung: Analysen koennen trotz stabilem lokalen Backend fehlschlagen oder langsamer werden.
- Gegenmassnahme: Adapter-Port, explizite Provider-Konfiguration, persistierte Traceability-Felder und weiterhin vollstaendig offline ausfuehrbare Tests.

## R2: Sprachdetektion ist heuristisch und nicht fachlich unfehlbar

- Risiko: Kurze oder gemischte Texte koennen mit zu geringer Sicherheit oder mit falscher Sprache erkannt werden.
- Auswirkung: Laeufe koennen frueh als `failed` enden oder auf Basis einer falschen Sprachannahme analysiert werden.
- Gegenmassnahme: lokale Confidence-Schwelle `0.80`, explizite Fehlercodes, sichtbare Sprachmetadaten und kein stiller Fallback.

## R3: Begrenzte E2E-Abdeckung

- Risiko: Der Browser-Nachweis deckt bewusst nur UJ1 als kritischen Happy Path ab.
- Auswirkung: Fehler in alternativen UI-Pfaden oder in zusammengesetzten Randfaellen koennen spaet entdeckt werden.
- Gegenmassnahme: Unit-, API-, Persistenz- und Integrationstests tragen den Hauptteil der Abdeckung; E2E bleibt minimal und stabil.

## R4: Unterschied zwischen lokalem Compose-Betrieb und spaeterem Produktivbetrieb

- Risiko: Compose verifiziert den lokalen Zielbetrieb, aber nicht produktionsnahe Themen wie TLS, Secret-Management, Observability oder externe Reverse-Proxies.
- Auswirkung: Ein spaeterer Deployment-Schritt kann weitere Infrastrukturarbeit erfordern.
- Gegenmassnahme: Konfiguration bereits ueber Umgebungsvariablen, klare Container-Schnitte (`frontend`, `api`, `db`) und dokumentierte Betriebsbefehle.

## R5: Sprach- und Analysequalitaet bleibt modellabhaengig

- Risiko: Die fachliche Qualitaet der sechs Analyseebenen haengt langfristig vom verwendeten Modell und Prompt ab.
- Auswirkung: Vertragstreue ist abgesichert, semantische Qualitaet jedoch nur begrenzt.
- Gegenmassnahme: Prompt-Versionierung, `model_id`-Persistenz, Validation-/Repair-Mechanik und explizite Fehlersemantik statt stiller Fallbacks.

## R6: Testkonfigurationsdrift zwischen Unit- und E2E-Tooling

- Risiko: Frontend-Unit- und E2E-Tests verwenden unterschiedliche Runner; ohne saubere Abgrenzung koennen sich Testdateien gegenseitig stoeren.
- Auswirkung: Finale Verifikation oder CI-Laeufe koennen an Tooling-Konflikten scheitern.
- Gegenmassnahme: Vitest schliesst `frontend/e2e/` explizit aus, Playwright bleibt ueber `npm run test:e2e` getrennt.
