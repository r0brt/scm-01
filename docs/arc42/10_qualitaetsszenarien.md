# Qualitätsszenarien

Die folgenden Qualitätsszenarien konkretisieren die Qualitätsziele aus Kapitel 1. Sie prüfen vor allem Vertragstreue, Nachvollziehbarkeit, Reproduzierbarkeit, Sprachbehandlung und die Grenzen der KI-gestützten Analyse.

Quantitative PRD-Zielgrössen werden in der aktuellen Dokumentation bewusst getrennt ausgewiesen: Vertrag, Fehlerpfad, Traceability, Sprachdetektion, UI und E2E sind technisch nachgewiesen. Die NFR1-Quote ist im Offline-Fixture-Harness über das definierte Eingabeset gemessen; die NFR3-p95-Laufzeitmessung ist als Offline-API-Benchmark dokumentiert. Das NFR5-Coverage-Ziel ist für den Backend-Domain-/Application-Scope gemessen. Der aktuelle Stand ist in `docs/test-report.md` und `docs/acceptance-checklist.md` dokumentiert.

| Qualitätsziel | Relevante Szenarien | Nachweis | Status / Grenze |
| --- | --- | --- | --- |
| Vertragstreue | QS1 | Contract-, Validation-, API- und Integrationstests; NFR1-Fixture-Harness | Offline nachgewiesen; keine Aussage zur Live-Providerqualität. |
| Nachvollziehbarkeit | QS2, QS9 | Persistenztests, API-Detailabruf, Observability-Test und Run-Metadaten | Pro Run gut nachvollziehbar; kein vollständiger Ende-zu-Ende-Audit-Trail. |
| Reproduzierbarkeit | QS3, QS4 | README-Kommandos, CI, Frontend-Build, Playwright-UJ1-Pfad und Compose-Nachweis | Lokal und in CI belegt; Umgebungsvoraussetzungen bleiben relevant. |
| Sprachbehandlung | QS5 | Backend-Tests für Sprachdetektion, Workflow und API | Unterstützt `de`, `fr`, `en`; weitere Sprachen sind nicht Teil des MVP. |
| Providerrobustheit | QS6 | Adapter-, App-Factory- und API-Fehlervertragstests | Tests laufen ohne Netz; produktionsnahe Provider-Verfügbarkeit ist nicht gemessen. |
| Datenschutz und Governance | QS7, QS8 | Datenmodell, API, Archiv-Metadaten, `docs/privacy-and-ai-governance.md` | Datenpfade und Grenzen sind dokumentiert; keine produktionsreife Compliance-Sicht. |
| Messbare NFRs | QS10, QS11, QS12 | `docs/test-report.md`, `docs/acceptance-checklist.md`, NFR-Skripte und Coverage-Report | Messungen sind bewusst als lokale/offline Nachweise eingeordnet. |

## QS1: Vertragskonforme Analyseausgabe

- Szenario: Ein Nutzer startet eine Analyse über API oder UI.
- Stimulus: Der Analyse-Workflow erzeugt ein JSON-Payload.
- Erwartung: Das Payload ist schema-valide im aktiven SCM-Vertrag mit `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz`, oder der Run wird explizit als `failed` mit `validation_report` und `error_code` persistiert.
- Nachweis: Contract-, Validation-, API- und Integrationstests im Backend, der Offline-NFR1-Messlauf über 20 Eingabe-Fixtures sowie persistierte Run-Metadaten gemäss `docs/test-report.md`.

## QS2: Nachvollziehbarer Analyse-Run

- Szenario: Ein Maintainer oder Reviewer prüft einen bereits gelaufenen Analyse-Run.
- Stimulus: Ein Run wird über API oder Datenbank erneut betrachtet.
- Erwartung: `input_text`, `analysis_json`, `validation_report`, `correlation_id`, `model_id`, `prompt_version`, `run_status` und `validation_status` sind nachvollziehbar gespeichert und über API beziehungsweise Archivansicht erklärbar. Die requestgebundene `correlation_id` ist zusätzlich im `X-Correlation-ID` Response-Header und im Request-Log-Kontext sichtbar.
- Nachweis: Persistenztests, API-Detailabruf, API-Observability-Test, Frontend-Archivverhalten und Datenmodell `runs`.

## QS3: Reproduzierbare lokale Ausführung

- Szenario: Das System soll auf einer frischen lokalen Umgebung erneut gestartet und getestet werden.
- Stimulus: Ein Maintainer führt die dokumentierten `uv`, `npm` und `docker compose` Commands aus.
- Erwartung: Backend-Tests, Frontend-Tests, Frontend-Build, lokaler frontendseitiger UJ1-E2E-Pfad und Compose-Startfähigkeit sind reproduzierbar. Bekannte Voraussetzungen wie Playwright-Browser-Binaries, Docker-Zugriff und lokale Portbelegung sind sichtbar dokumentiert.
- Nachweis: README-Kommandos, `docs/test-report.md`, `docs/acceptance-checklist.md` sowie die dort beschriebenen lokalen Voraussetzungen für Compose und Playwright.

## QS4: Kritische Nutzerreise UJ1

- Szenario: Ein Endnutzer gibt einen Problemtext ein und startet eine Analyse im Frontend.
- Stimulus: Texteingabe und Klick auf `Analyse starten`.
- Erwartung: Ein neuer Run wird erzeugt und die Pipeline mit den sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` wird sichtbar. Archiv-, Export- und Metadatenfunktionen bleiben davon getrennt, damit die Analyseansicht auf den aktuellen Run fokussiert bleibt.
- Nachweis: Playwright-Journey-Test für UJ1 mit kontrolliert gemockter Analyse-API sowie ergänzende Backend-, API-, Frontend- und Persistenztests für den realen Analyse-, Validierungs- und Speicherpfad.

## QS5: Deterministische Sprachvorprüfung

- Szenario: Ein Nutzer sendet einen Text in `de`, `fr`, `en` oder in einer schlecht erkennbaren Mischform.
- Stimulus: Start eines Analyse-Runs über API oder UI.
- Erwartung: Das System erkennt unterstützte Sprachen lokal mit Confidence-Wert; bei `confidence < 0.80` oder nicht unterstützter Sprache endet der Run explizit als `failed`.
- Nachweis: Backend-Tests für Sprachdetektion, Workflow und API.

## QS6: Reale Providerintegration ohne Netz in Tests

- Szenario: Die produktive Analyse soll OpenAI verwenden, während Testläufe offline und reproduzierbar bleiben.
- Stimulus: Konfiguration von `SCM_ANALYSIS_PROVIDER=openai` im Laufzeitsystem bzw. Fake-Adapter in Tests.
- Erwartung: Der Produktionspfad verwendet den OpenAI-Adapter und fordert den aktiven SCM-Vertrag aus Prompt und Schema an; technische Providerfehler vor einem verwertbaren Payload werden als `ANALYSIS_PROVIDER_ERROR` mit HTTP 502 über den API-Fehlervertrag beantwortet und nicht als Analyse-Run persistiert. Tests bleiben ohne externe Netzaufrufe stabil.
- Nachweis: Adapter-, App-Factory- und API-Fehlervertragstests mit injizierten Fakes sowie dokumentierte Laufzeitkonfiguration.

## QS7: Begrenzte Weitergabe sensibler Freitexte

- Szenario: Ein Nutzer erfasst einen problemnahen Freitext, der personenbezogene oder anderweitig sensible Angaben enthalten kann.
- Stimulus: Der Analyse-Run wird über API oder UI gestartet.
- Erwartung: Das System behandelt `input_text` als potenziell sensibel, dokumentiert die optionale externe Provider-Weitergabe als bewusste Betriebsannahme und beschränkt gespeicherte Nachweise auf Input, Analyse, Metadaten und Validierungsreport ohne zusätzliche stille Anreicherung.
- Nachweis: Datenmodell `runs`, API-Detailabruf, `docs/privacy-and-ai-governance.md` und Architekturkapitel zu Laufzeit- und Datenschutzannahmen.

## QS8: Verständlichkeit als KI-gestützte Analysehilfe

- Szenario: Ein Nutzer, Maintainer oder Stakeholder betrachtet ein Analyseergebnis und leitet daraus weitere Diskussionen ab.
- Stimulus: Ein gespeicherter Run wird in UI, API oder Dokumentation erklärt.
- Erwartung: Das System bleibt als KI-gestützte Analysehilfe verständlich und wird nicht als Wahrheitsmaschine beschrieben. Unsicherheit, Modellbezug, menschliche Verantwortung und die Nicht-Ziele der fachlichen Bewertung bleiben nachvollziehbar.
- Nachweis: PRD-Nicht-Ziele, API-Vertrag, persistierte Run-Metadaten, `docs/privacy-and-ai-governance.md` und arc42-Kapitel zu Qualitätszielen, Governance und Risiken.

## QS9: Erklärbarer Audit-Pfad pro gespeichertem Run

- Szenario: Ein Maintainer untersucht nachträglich, weshalb ein bestimmter Run zustande kam oder weshalb er fehlgeschlagen ist.
- Stimulus: Ein gespeicherter Run wird über API oder Datenbank mit seinem Detailkontext geöffnet.
- Erwartung: Der Run lässt sich mindestens über `input_text`, `analysis_json`, `validation_report`, `correlation_id`, `model_id`, `prompt_version`, `run_status`, `validation_status`, den API-Response-Header, den Request-Log-Kontext und bekannte Audit-Lücken erklären. Damit bleibt der Interpretationsrahmen sichtbar, ohne einen vollständigen produktiven Ende-zu-Ende-Audit-Trail zu behaupten.
- Nachweis: Persistenzmodell `runs`, Detailansicht der Analyse-Runs, Dokumentation zu Audit-Grenzen sowie gezielte Persistenz- und API-Observability-Tests.

## QS10: Transparenter Umgang mit gemessenen und nicht gemessenen NFRs

- Szenario: Ein Maintainer oder Reviewer prüft, welche quantitativen Qualitätsziele tatsächlich gemessen wurden.
- Stimulus: `docs/test-report.md`, `docs/acceptance-checklist.md` und die PRD-NFRs werden verglichen.
- Erwartung: Die Dokumentation unterscheidet klar zwischen erfüllten technischen Nachweisen, offline gemessenen Zielgrössen, Teilnachweisen und nicht gemessenen Zielgrössen. NFR1 `>=90%` wird nur als Offline-Fixture-Harness-Messung eingeordnet; NFR3 `p95 < 5s` wird nur als lokale Offline-API-Messung ohne externen LLM-Provider eingeordnet. NFR5 `80% Unit-Test-Coverage` wird nur für den Backend-Domain-/Application-Scope ohne UI, API-Bootstrapping und Infrastrukturcode eingeordnet.
- Nachweis: NFR-Evidenzstatus in `docs/test-report.md` und `docs/acceptance-checklist.md`.

## QS11: Offline gemessene API-Antwortzeit

- Szenario: Ein Maintainer oder Reviewer prüft die PRD-Zielgrösse `p95 < 5s` für Analyseantworten bis 1'000 Zeichen.
- Stimulus: `scripts/measure_nfr3_performance.py` führt die 20 statischen Eingabe-Fixtures plus einen deterministischen 1'000-Zeichen-Grenzfall über `POST /api/v1/analyses` aus.
- Erwartung: Alle gemessenen Requests laufen nach App-Initialisierung und Warm-up erfolgreich durch; die Eingabetexte bleiben innerhalb der PRD-Grenze von 1'000 Zeichen und die p95-Antwortzeit liegt unter 5 Sekunden.
- Nachweis: `docs/test-report.md` dokumentiert den Offline-Messlauf mit `21/21` erfolgreichen API-Analysen, einem 1'000-Zeichen-Grenzfall, `p95 0.003s` und langsamstem Request `0.005s`. Die Messung nutzt deterministische Fixture-Doubles und ersetzt keinen produktionsnahen Lasttest mit externem Provider.

## QS12: Gemessene Backend-Coverage im Domain-/Application-Layer

- Szenario: Ein Maintainer oder Reviewer prüft die PRD-Zielgrösse `>=80%` Unit-Test-Coverage für den Domain-/Application-Layer ohne UI.
- Stimulus: `coverage run -m pytest` wird für die backendnahen Contract-, Language-, LLM-, Service-, Validation- und Persistence-Tests ausgeführt.
- Erwartung: Die Coverage-Konfiguration misst `app/language`, `app/llm`, `app/models`, `app/repositories` und `app/services`; die gemessene Statement Coverage liegt mindestens bei 80%.
- Nachweis: `docs/test-report.md` dokumentiert `95%` Statement Coverage (`232` Statements, `12` Misses) gegen `fail_under = 80`. UI, API-Bootstrapping, Datenbank-Session-Infrastruktur, Alembic-Migrationen und produktionsnahe Systemabdeckung sind nicht Teil dieser Kennzahl.
