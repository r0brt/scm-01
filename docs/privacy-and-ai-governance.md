# Datenschutz und KI-Governance

## Zweck und Einordnung

Dieses Dokument ergänzt die arc42-Architekturdokumentation um eine kompakte Sicht auf Datenschutz, Nachvollziehbarkeit und KI-Governance im aktuellen SCM-MVP. Es beschreibt den tatsächlich implementierten Stand des Repositories, die dabei verarbeiteten Daten, die relevanten externen Abhängigkeiten und die bewusst offengelegten Grenzen.

Dieses Dokument ist eine Architektur- und MVP-Governance-Sicht. Es macht Datenflüsse, Verantwortlichkeiten, externe Abhängigkeiten und Grenzen nachvollziehbar, behauptet aber keine vollständige rechtliche Konformität für einen konkreten Produktivbetrieb.

Es ersetzt keine formale Rechtsberatung, kein vollständiges Datenschutzkonzept für einen Produktivbetrieb und keine behördliche oder gerichtliche Einordnung. Massgeblich bleibt deshalb: arc42 ist das Primärdokument der Architektur, dieses Dokument dient als unterstützendes Governance-Artefakt für die Einordnung des MVP.

## Nachweisbezug

Dieses Dokument verweist inhaltlich auf folgende Nachweise:

- `docs/arc42/08_querschnittliche_konzepte.md` für Cross-Cutting Concepts, Datenschutz, LLM-Adapter und Traceability
- `docs/acceptance-checklist.md` für den aktuellen Abnahmestand
- `docs/test-report.md` für lokal und in CI dokumentierte Verifikation
- `docs/diagrams/rendered/` für gerenderte Architektur- und Datenflussdiagramme

## Verarbeitete Daten

Der fachliche Kern des Systems ist die Verarbeitung eines frei eingegebenen Problemtexts. Dieser Rohtext wird als `input_text` unverändert übernommen und kann personenbezogene, sensible oder kontextuell heikle Informationen enthalten, wenn eine nutzende Person solche Inhalte eingibt.

Während der Verarbeitung entstehen und verbleiben im System insbesondere folgende Datenarten:

- `input_text` als unveränderter Eingabetext
- `analysis_json` als strukturierter Analyse-Payload mit den sechs SCM-Ebenen
- `validation_report` als technischer Prüfpfad über Schema-, Modell- und gegebenenfalls Sprachprüfungen
- Sprachmetadaten wie `detected_language` und `language_confidence`
- Traceability-Metadaten wie `correlation_id`, `prompt_version`, `model_id`, `run_status`, `validation_status`, `error_code`, `error_reason` und `created_at`

Diese Daten dienen im MVP nicht der Profilbildung über Personen, sondern der nachvollziehbaren Durchführung, Validierung, Anzeige und Wiederverwendung einzelner Analyse-Runs. Das System speichert keine Benutzerkonten und keine Mehrmandantenstruktur, aber der fachliche Inhalt eines Runs kann trotzdem Rückschlüsse auf Personen, Gruppen, Organisationen oder konkrete Situationen erlauben.

## Datenflüsse und externe Empfänger

Der reale Datenpfad im SCM-MVP verläuft in klaren Stufen:

1. Eine nutzende Person erfasst im Browser über das Frontend einen Problemtext.
2. Das Frontend übermittelt den Text per HTTP/JSON an die Backend-API.
3. Das Backend führt die Spracherkennung lokal aus und erzeugt daraus Sprachmetadaten.
4. Danach geht der Text entweder in einen rein lokalen Stub-Pfad oder, bei aktivierter Produktivkonfiguration, an den OpenAI-Adapter.
5. Im OpenAI-Pfad werden der Problemtext, die erkannte Sprache, der versionierte Prompt und das angeforderte JSON-Schema an die externe OpenAI Responses API übergeben, um daraus den Analyse-Payload zu erzeugen.
6. Das Backend validiert den erhaltenen Payload, ergänzt den `validation_report` und prüft bei erfolgreicher Struktur zusätzlich die dominante Sprache der Analyseausgabe.
7. Abschliessend persistiert das Backend den Run lokal mit `input_text`, `analysis_json` oder Fehlerzustand, `validation_report` und den Traceability-Metadaten.

Externer Empfänger im engeren Sinn ist nur der optional aktivierte OpenAI-Pfad. Ohne entsprechende Konfiguration bleibt der Stub-Adapter aktiv und es findet für die Analyseerzeugung kein externer Netzaufruf statt. Unabhängig davon bleibt die lokale Spracherkennung im Backend.

Lokale Persistenz bedeutet im aktuellen Implementationsstand eine relationale Speicherung im vom Backend konfigurierten Datenbankpfad. Ohne gesetzte Variable `SCM_DATABASE_URL` läuft der lokale Default auf SQLite; für den beabsichtigten Compose- und Deployment-Pfad ist PostgreSQL vorgesehen. Das Repository beschreibt damit eine lokal kontrollierte Persistenz mit klarer technischer Zielarchitektur, aber keine ausformulierte produktive Betriebsorganisation mit belastbaren Aussagen zu Backups, Aufbewahrungsprozessen oder rechtlicher Gesamtverantwortung.

## Aufbewahrung und Löschannahmen

Das System behandelt Analyse-Runs als nachvollziehbare Datensätze. Ein erfolgreicher oder fehlgeschlagener Lauf wird deshalb zusammen mit Prüf- und Traceability-Informationen gespeichert, damit Resultate, Fehlerbilder und Reruns später nachvollzogen werden können.

Für den MVP bestehen nur begrenzte Aufbewahrungs- und Löschannahmen:

- Runs bleiben in der lokalen Persistenz erhalten, bis die zugrunde liegende Datenbank oder Entwicklungsumgebung bewusst bereinigt wird.
- Es gibt im aktuellen Stand keine fachliche Löschfunktion, keine Aufbewahrungsfristen pro Datenkategorie und keinen dokumentierten operativen Prozess für Auskunft, Berichtigung oder Löschung.
- Für den optionalen OpenAI-Pfad werden im Repository selbst keine zusätzlichen Speicherzusagen gegenüber dem externen Anbieter gemacht; dafür wären die jeweils gültigen Anbieterbedingungen und ein separates Betriebssetup massgeblich.

Lokale Bereinigung erfolgt im MVP deshalb nicht als fachlicher Nutzerprozess, sondern als bewusste Umgebungsbereinigung. Im Compose-Betrieb kann die lokale PostgreSQL-Persistenz zum Beispiel mit `docker compose down -v` entfernt werden. Lokale SQLite-Dateien aus Entwicklungs- oder E2E-Läufen können gezielt gelöscht werden, etwa `backend/e2e.db` oder `backend/scm.db`, sofern diese Dateien in der jeweiligen Umgebung verwendet wurden.

Die Doku beschreibt damit den Ist-Zustand ehrlich: nachvollziehbare Speicherung ist technisch vorhanden, ausgereifte Privacy Operations für einen Produktivbetrieb jedoch nicht.

## Transparenz und menschliche Verantwortung

SCM ist als unterstützendes Analysewerkzeug konzipiert, nicht als autonom entscheidendes System. Die Anwendung zerlegt eingegebene Problemtexte in sechs Ebenen, bewertet deren Inhalt aber nicht als wahr, falsch oder rechtlich verbindlich. Menschliche Verantwortung bleibt insbesondere an drei Stellen zentral:

- bei der Auswahl und Eingabe des Ausgangstexts
- bei der Interpretation der erzeugten Analyse
- bei jeder Weiterverwendung der Resultate in Diskussion, Lehre oder Entscheidungsprozessen

Transparenz entsteht im MVP vor allem über die sichtbare Pipeline-Darstellung im Frontend sowie über die gespeicherten technischen Metadaten eines Runs. Nachvollziehbar sind heute insbesondere `correlation_id`, `prompt_version`, `model_id`, `validation_report`, `run_status`, `validation_status`, `error_code` und `created_at`. Die `correlation_id` wird pro HTTP-Request erzeugt, bei Fehlerantworten wiederverwendet und bei neu erzeugten Runs mitpersistiert. Zusätzlich erscheint sie als `X-Correlation-ID` Response-Header und im strukturierten Request-Log-Kontext mit Methode, Pfad und Statuscode. Dadurch ist ein nachvollziehbarer Request-to-Run-Pfad vorhanden. Nicht durchgängig gelöst ist dagegen ein Ende-zu-Ende-Auditkontext über alle Schichten hinweg; insbesondere fehlen weiterhin ein vollständiger Frontend-zu-Backend-zu-Provider-Trace sowie eine produktionsreife Logging- und Monitoring-Sicht.

## AI-Act-Einordnung

Für das aktuelle SCM-MVP ist eine vorsichtige, architekturbezogene Einordnung sinnvoller als eine scheinbar definitive Rechtsqualifikation. Das System analysiert frei formulierte Texte mithilfe eines LLM-gestützten Verarbeitungspfads und stellt die Ergebnisse für menschliche Betrachtung transparent dar. Es trifft keine automatisierten Personenentscheide, bewertet keine Kreditwürdigkeit, steuert keine kritische Infrastruktur und beansprucht keine hoheitliche oder sicherheitskritische Sonderrolle.

Plausibel ist deshalb eine Einordnung als KI-gestütztes Analyse- und Strukturierungswerkzeug mit erhöhtem Bedarf an Transparenz, Nachvollziehbarkeit und menschlicher Kontrolle, aber ohne belastbare Behauptung, dass damit bereits sämtliche regulatorischen Pflichten vollständig abgedeckt wären. Im Vordergrund stehen dabei folgende Governance-Gedanken:

- Eingaben können personenbezogene oder sensible Inhalte enthalten und dürfen deshalb nicht als rein harmlose Testdaten behandelt werden.
- Der optionale OpenAI-Pfad ist als externer Verarbeitungs- und Abhängigkeitsfaktor offen zu benennen.
- Resultate benötigen menschliche Prüfung und dürfen nicht als selbstgenügende Tatsachenfeststellung oder autonome Entscheidung gelesen werden.
- Traceability und klare Grenzen sind Teil der Systemverantwortung, auch wenn das MVP noch kein vollständiges Compliance-Betriebsmodell besitzt.

Für die Rollenbetrachtung ist wichtig: Das Repository entwickelt kein eigenes General-Purpose-AI-Modell, trainiert kein Basismodell und verändert keine Modellgewichte. Es integriert im optionalen Produktivpfad ein externes Modell über einen Adapter und nutzt dessen Ausgabe für eine strukturierte Analysefunktion. Die primäre Projektsicht liegt damit auf der verantwortungsvollen Bereitstellung und Nutzung dieser KI-gestützten Funktion: transparente Kennzeichnung, menschliche Letztverantwortung, dokumentierte Datenflüsse, nachvollziehbare Runs und klare Grenzen des MVP.

Nach der offiziellen EU-Einordnung werden Pflichten zeitlich gestaffelt wirksam; insbesondere gelten Pflichten für Anbieter von General-Purpose-AI-Modellen früher als viele Transparenzpflichten für bestimmte KI-Systeme. Referenzpunkte sind die [EU-Übersicht zum AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) und die [EU-Seite zu GPAI-Pflichten](https://digital-strategy.ec.europa.eu/en/factpages/general-purpose-ai-obligations-under-ai-act). Dieses Dokument hält deshalb bewusst Architektur- und Governance-Massnahmen fest, ersetzt aber keine formale AI-Act-Konformitätsprüfung für einen konkreten Produktivbetrieb.

## Grenzen des MVP

Dieses Repository macht bewusst keine der folgenden Behauptungen:

- keine formale juristische Stellungnahme oder belastbare Rechtsmeinung zu Datenschutz-, Vertrags- oder AI-Act-Fragen
- keine produktionsreife Privacy- oder Governance-Organisation mit vollständigen Prozessen für Löschung, Incident Handling, Auskunft oder Anbietersteuerung
- kein Anspruch auf Vollständigkeit einer Compliance-Prüfung oder auf bereits abschliessend nachgewiesene Konformität

Weitere reale Grenzen des MVP sind:

- kein Benutzer- und Rollenmodell für feingranulare Zugriffssteuerung
- kein vollständiger Audit- oder Logging-Kontext über Frontend, API, Persistenz und externe Anbieter; die requestgebundene `correlation_id` ist in API-Headern, Run-Daten und Request-Logs sichtbar, ersetzt aber noch keine vollständige Ende-zu-Ende-Observability
- keine Aussage darüber, dass eingegebene Inhalte für jeden realen Einsatzkontext datenschutzrechtlich zulässig wären
- keine Garantie, dass ein LLM-generiertes Analyseergebnis inhaltlich richtig, ausgewogen oder risikofrei ist

Entscheidend ist deshalb, dass das System seine Datenpfade und Governance-Grenzen offenlegt, statt eine Vollreife zu simulieren, die im aktuellen MVP nicht vorhanden ist.
