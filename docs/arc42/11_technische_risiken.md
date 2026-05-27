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
- Gegenmassnahme: Konfiguration bereits über Umgebungsvariablen, klare Container-Schnitte (`frontend`, `api`, `db`) und dokumentierte Betriebsbefehle.

## R5: Sprach- und Analysequalitaet bleibt modellabhaengig

- Risiko: Die fachliche Qualitaet der sechs Analyseebenen haengt langfristig vom verwendeten Modell und Prompt ab.
- Auswirkung: Vertragstreue ist abgesichert, semantische Qualitaet jedoch nur begrenzt.
- Gegenmassnahme: Prompt-Versionierung, `model_id`-Persistenz, Validation-/Repair-Mechanik und explizite Fehlersemantik statt stiller Fallbacks.

## R6: Testkonfigurationsdrift zwischen Unit- und E2E-Tooling

- Risiko: Frontend-Unit- und E2E-Tests verwenden unterschiedliche Runner; ohne saubere Abgrenzung koennen sich Testdateien gegenseitig stoeren.
- Auswirkung: Finale Verifikation oder CI-Laeufe koennen an Tooling-Konflikten scheitern.
- Gegenmassnahme: Vitest schliesst `frontend/e2e/` explizit aus, Playwright bleibt über `npm run test:e2e` getrennt.

## R7: Personenbezogene Daten in Freitexten

- Risiko: Freiformulierte Problemtexte können Namen, Gesundheitsbezüge, Vorwürfe oder andere personenbezogene Angaben enthalten, obwohl das MVP keine ausgereifte Datenschutz- oder Klassifikationsschicht besitzt.
- Auswirkung: Sensible Inhalte können im Input, in Analyseartefakten oder bei externer Provider-Verarbeitung in einem grösseren Umfang erscheinen als fachlich nötig.
- Gegenmassnahme: Die Architektur behandelt `input_text` grundsätzlich als potenziell sensibel, dokumentiert die Weitergabe an externe Provider explizit und vermeidet zusätzliche stille Anreicherung oder Sekundärnutzung. Das ist eine Begrenzung und keine vollständige Compliance-Zusage.

## R8: Abhängigkeit von externen KI-Providern

- Risiko: Die fachliche Kernfunktion hängt im produktiven Pfad von einem externen KI-Provider mit eigener Verfügbarkeit, Modellpolitik und Datenverarbeitung ab.
- Auswirkung: Änderungen bei Erreichbarkeit, Preis, Vertragsbedingungen oder Modellverhalten können das System technisch und organisatorisch beeinflussen.
- Gegenmassnahme: Provider-Zugriffe bleiben hinter einem Adapter-Port gekapselt, Konfiguration und Traceability-Felder werden persistiert, und der MVP macht diese Abhängigkeit architektonisch sichtbar statt sie zu kaschieren.

## R9: Falsche Wahrnehmung von Objektivität

- Risiko: Nutzer oder Stakeholder könnten die strukturierte Ausgabe fälschlich als objektive Wahrheit, neutrale Bewertung oder belastbare Faktengrundlage interpretieren.
- Auswirkung: Analyseergebnisse werden über ihren didaktischen und unterstützenden Zweck hinaus verwendet, was Fehlentscheide oder unangemessene Autoritätszuschreibungen begünstigen kann.
- Gegenmassnahme: PRD-Nicht-Ziele, Metadaten, UI-/API-Sprache und arc42 betonen, dass SCM eine KI-gestützte Analysehilfe und keine Wahrheitsmaschine ist.

## R10: Unvollständige Audit-Trails

- Risiko: Ein gespeicherter Run kann zwar Input, Output und zentrale Metadaten enthalten, aber nicht automatisch jeden externen Kontext, jede Modellinterna oder jede organisatorische Entscheidung vollständig belegen.
- Auswirkung: Nachträgliche Erklärbarkeit bleibt begrenzt, insbesondere wenn Interpretationen oder Betriebsannahmen ausserhalb des gespeicherten Runs entstanden sind.
- Gegenmassnahme: Die Architektur fordert einen starken Mindest-Audit-Pfad über Payload, Validierungsreport und Metadaten und dokumentiert bekannte Audit-Lücken ausdrücklich, statt Vollständigkeit zu behaupten.

## R11: MVP-Grenze gegenüber Produktionsansprüchen

- Risiko: Architekturentscheidungen des MVP könnten irrtümlich als produktionsreife Datenschutz-, Governance- oder Compliance-Lösung verstanden werden.
- Auswirkung: Spätere Betriebsentscheide würden auf zu schwachen organisatorischen und technischen Annahmen aufbauen.
- Gegenmassnahme: arc42 trennt bewusst zwischen MVP-Nachweis und weitergehenden Produktionsanforderungen wie Löschkonzepten, Zugriffskontrolle, Auftragsdatenbearbeitung, Monitoring und formeller Governance.
