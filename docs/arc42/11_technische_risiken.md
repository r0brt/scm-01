# Technische Risiken

Die technischen Risiken beschreiben die wichtigsten Grenzen des aktuellen MVP. Sie zeigen, wo Architekturentscheidungen bewusst absichern, aber noch keine produktionsreife Vollständigkeit herstellen.

## R1: Reale Provider-Integration bringt externe Laufzeitrisiken mit

- Risiko: Der OpenAI-Pfad hängt von externer Verfügbarkeit, Latenz, Rate Limits und gültiger API-Konfiguration ab.
- Auswirkung: Analysen können trotz stabilem lokalem Backend fehlschlagen oder langsamer werden. Technische Adapter- oder Providerfehler vor einem verwertbaren Analyse-Payload werden nicht als validierter `failed` Run persistiert.
- Gegenmassnahme: Adapter-Port, explizite Provider-Konfiguration, API-Fehlervertrag `ANALYSIS_PROVIDER_ERROR` mit HTTP 502 und `correlation_id`, persistierte Traceability-Felder für fachliche Fehlerläufe und weiterhin vollständig offline ausführbare Tests.

## R2: Sprachdetektion ist heuristisch und nicht fachlich unfehlbar

- Risiko: Kurze oder gemischte Texte können mit zu geringer Sicherheit oder mit falscher Sprache erkannt werden.
- Auswirkung: Läufe können früh als `failed` enden oder auf Basis einer falschen Sprachannahme analysiert werden.
- Gegenmassnahme: Lokale Confidence-Schwelle `0.80`, explizite Fehlercodes, sichtbare Sprachmetadaten und kein stiller Fallback.

## R3: Begrenzte E2E-Abdeckung

- Risiko: Der Browser-Nachweis deckt bewusst nur UJ1 als kritischen Happy Path ab.
- Auswirkung: Fehler in alternativen UI-Pfaden oder in zusammengesetzten Randfällen können spät entdeckt werden.
- Gegenmassnahme: Unit-, API-, Persistenz- und Integrationstests tragen den Hauptteil der Abdeckung; E2E bleibt minimal und stabil. Der aktuelle Nachweis ist in `docs/test-report.md` dokumentiert.

## R4: Unterschied zwischen lokalem Compose-Betrieb und späterem Produktivbetrieb

- Risiko: Compose verifiziert den lokalen Zielbetrieb, aber nicht produktionsnahe Themen wie TLS, Secret-Management, Observability oder externe Reverse-Proxies.
- Auswirkung: Ein späterer Deployment-Schritt kann weitere Infrastrukturarbeit erfordern.
- Gegenmassnahme: Konfiguration bereits über Umgebungsvariablen, klare Container-Schnitte (`frontend`, `api`, `db`) und dokumentierte Betriebsbefehle. `docs/acceptance-checklist.md` trennt deshalb lokalen MVP-Nachweis und mögliche Folgearbeit.

## R5: Sprach- und Analysequalität bleibt modellabhängig

- Risiko: Die fachliche Qualität der sechs Analyseebenen hängt langfristig vom verwendeten Modell und Prompt ab.
- Auswirkung: Vertragstreue ist technisch abgesichert, semantische Qualität jedoch nur begrenzt objektivierbar.
- Gegenmassnahme: Prompt-Versionierung, `model_id`-Persistenz, aktive Validierung, vorbereitete Repair-Mechanik und explizite Fehlersemantik statt stiller Fallbacks. Die Dokumentation beschreibt SCM deshalb als Analysehilfe und nicht als Wahrheitsmaschine.

## R6: Testkonfigurationsdrift zwischen Unit- und E2E-Tooling

- Risiko: Frontend-Unit- und E2E-Tests verwenden unterschiedliche Runner; ohne saubere Abgrenzung können sich Testdateien gegenseitig stören.
- Auswirkung: Finale Verifikation oder CI-Läufe können an Tooling-Konflikten scheitern.
- Gegenmassnahme: Vitest schliesst `frontend/e2e/` explizit aus, Playwright bleibt über `npm run test:e2e` getrennt. Der Testreport dokumentiert die getrennten Commands und lokalen Voraussetzungen.

## R7: Personenbezogene Daten in Freitexten

- Risiko: Freiformulierte Problemtexte können Namen, Gesundheitsbezüge, Vorwürfe oder andere personenbezogene Angaben enthalten, obwohl das MVP keine ausgereifte Datenschutz- oder Klassifikationsschicht besitzt.
- Auswirkung: Sensible Inhalte können im Input, in Analyseartefakten oder bei externer Provider-Verarbeitung in einem grösseren Umfang erscheinen als fachlich nötig.
- Gegenmassnahme: Die Architektur behandelt `input_text` grundsätzlich als potenziell sensibel, dokumentiert die optionale Weitergabe an externe Provider explizit und vermeidet zusätzliche stille Anreicherung oder Sekundärnutzung. Das ist eine Begrenzung und keine vollständige Compliance-Zusage.

## R8: Abhängigkeit von externen KI-Providern

- Risiko: Die fachliche Kernfunktion hängt im produktiven Pfad von einem externen KI-Provider mit eigener Verfügbarkeit, Modellpolitik und Datenverarbeitung ab.
- Auswirkung: Änderungen bei Erreichbarkeit, Preis, Vertragsbedingungen oder Modellverhalten können das System technisch und organisatorisch beeinflussen.
- Gegenmassnahme: Provider-Zugriffe bleiben hinter einem Adapter-Port gekapselt, Konfiguration und Traceability-Felder werden persistiert, und der MVP macht diese Abhängigkeit architektonisch sichtbar statt sie zu kaschieren. Für einen Produktivbetrieb bliebe zusätzlich eine formale Anbieter- und Vertragsprüfung nötig.

## R9: Falsche Wahrnehmung von Objektivität

- Risiko: Nutzer oder Stakeholder könnten die strukturierte Ausgabe fälschlich als objektive Wahrheit, neutrale Bewertung oder belastbare Faktengrundlage interpretieren.
- Auswirkung: Analyseergebnisse werden über ihren didaktischen und unterstützenden Zweck hinaus verwendet, was Fehlentscheide oder unangemessene Autoritätszuschreibungen begünstigen kann.
- Gegenmassnahme: PRD-Nicht-Ziele, Metadaten, UI-/API-Sprache und arc42 betonen, dass SCM eine KI-gestützte Analysehilfe und keine Wahrheitsmaschine ist. Menschliche Interpretation und Verantwortung bleiben explizit ausserhalb der automatisierten Systemleistung.

## R10: Unvollständige Audit-Trails

- Risiko: Ein gespeicherter Run kann zwar Input, Output und zentrale Metadaten enthalten, aber nicht automatisch jeden externen Kontext, jede Modellinterna oder jede organisatorische Entscheidung vollständig belegen.
- Auswirkung: Nachträgliche Erklärbarkeit bleibt begrenzt, insbesondere wenn Interpretationen oder Betriebsannahmen ausserhalb des gespeicherten Runs entstanden sind.
- Gegenmassnahme: Die Architektur fordert einen starken Mindest-Audit-Pfad über Payload, `correlation_id`, Validierungsreport und Metadaten und dokumentiert bekannte Audit-Lücken ausdrücklich, statt Vollständigkeit zu behaupten.

## R11: MVP-Grenze gegenüber Produktionsansprüchen

- Risiko: Architekturentscheidungen des MVP könnten irrtümlich als produktionsreife Datenschutz-, Governance- oder Compliance-Lösung verstanden werden.
- Auswirkung: Spätere Betriebsentscheide würden auf zu schwachen organisatorischen und technischen Annahmen aufbauen.
- Gegenmassnahme: arc42 und `docs/privacy-and-ai-governance.md` trennen bewusst zwischen MVP-Nachweis und weitergehenden Produktionsanforderungen wie Löschkonzepten, Zugriffskontrolle, Auftragsdatenbearbeitung, Monitoring und formeller Governance.
