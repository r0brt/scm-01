# 10 Qualitätsszenarien

## QS1: Vertragskonforme Analyseausgabe

- Szenario: Ein Nutzer startet eine Analyse ueber API oder UI.
- Stimulus: Der Analyse-Workflow erzeugt ein JSON-Payload.
- Erwartung: Das Payload ist schema-valide oder der Run wird explizit als `failed` mit `validation_report` und `error_code` persistiert.
- Nachweis: Contract- und Validation-Tests im Backend sowie persistierte Run-Metadaten.

## QS2: Nachvollziehbarer Analyse-Run

- Szenario: Ein Maintainer oder Evaluator prueft einen bereits gelaufenen Analyse-Run.
- Stimulus: Ein Run wird ueber API oder Datenbank erneut betrachtet.
- Erwartung: `input_text`, `analysis_json`, `validation_report`, `model_id`, `prompt_version`, `run_status` und `validation_status` sind nachvollziehbar gespeichert.
- Nachweis: Persistenztests, API-Detailabruf und Datenmodell `runs`.

## QS3: Reproduzierbare lokale Ausfuehrung

- Szenario: Das System soll auf einer frischen lokalen Umgebung erneut gestartet und getestet werden.
- Stimulus: Ein Maintainer fuehrt die dokumentierten `uv`, `npm` und `docker compose` Commands aus.
- Erwartung: Backend-Tests, Frontend-Build und Compose-Start laufen ohne manuelle Sonderpfade reproduzierbar.
- Nachweis: README-Kommandos, `docs/test-report.md` und M8/M9-Verifikationslaeufe.

## QS4: Kritische Nutzerreise UJ1

- Szenario: Ein Endnutzer gibt einen Problemtext ein und startet eine Analyse im Frontend.
- Stimulus: Texteingabe und Klick auf `Analyse starten`.
- Erwartung: Ein neuer Run wird erzeugt und die Pipeline mit den sechs Ebenen wird sichtbar.
- Nachweis: Playwright-E2E-Test fuer UJ1.
