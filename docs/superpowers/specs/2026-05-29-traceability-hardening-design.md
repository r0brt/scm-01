# Traceability Hardening Design

## Ziel

Diese Runde verbessert die technische Nachvollziehbarkeit einzelner Analyse-Requests, ohne in eine umfassende Logging- oder Observability-Ausbaustufe überzugehen. Jeder HTTP-Request soll genau eine `correlation_id` erhalten, und diese ID soll sowohl in Fehlerantworten als auch in neu erzeugten Analyse-Runs wiederauffindbar sein.

## Ausgangslage

Der aktuelle Stand des Repositories besitzt bereits mehrere gute Traceability-Felder pro Run, insbesondere `prompt_version`, `model_id`, `validation_report`, `run_status`, `validation_status`, `error_code` und `created_at`. Gleichzeitig bleibt die `correlation_id` aus dem Fehlervertrag technisch isoliert:

- sie wird pro Fehlerantwort frisch erzeugt
- sie ist nicht an den eigentlichen Request gebunden
- sie wird nicht mitpersistiert
- erfolgreiche Runs enthalten keine direkte Request-Korrelation

Dadurch ist die Nachvollziehbarkeit einzelner Runs im MVP bereits brauchbar, aber es fehlt ein klarer Request-to-Run-Faden.

## Scope

In Scope:

- eine einmal pro HTTP-Request erzeugte `correlation_id`
- Wiederverwendung dieser ID in API-Fehlerantworten
- Persistenz der `correlation_id` bei neu erzeugten Runs
- Aufnahme der `correlation_id` in die API-Response für Analyse-Runs
- kleine Test- und Doku-Anpassungen für den verbesserten Traceability-Pfad

Out of Scope:

- strukturierte Logging- oder Tracing-Infrastruktur
- Frontend-Änderungen
- weitergehende Audit- oder SIEM-Integration
- Änderungen an Prompt-, Validierungs- oder UI-Logik

## Designentscheidung

Die `correlation_id` wird als requestgebundene technische Kennung behandelt, nicht als rein fehlerbezogene Hilfs-ID.

Das bedeutet:

- ein Request erhält genau eine `correlation_id`
- Fehlerantworten desselben Requests verwenden diese ID
- wenn der Request einen neuen Analyse-Run erzeugt, wird dieselbe ID mitpersistiert
- spätere API-Responses dieses Runs liefern die ID wieder aus

Diese Runde verbessert damit die minimale Auditierbarkeit spürbar, ohne den Scope auf vollständige Ende-zu-Ende-Observability auszuweiten.

## Technische Leitlinien

### Request-Kontext

Die FastAPI-Anwendung soll früh im Request-Lifecycle eine `correlation_id` bereitstellen. Dafür ist eine leichte Middleware oder eine funktional gleichwertige Lösung geeignet. Wichtig ist nicht das konkrete FastAPI-Muster, sondern die Eigenschaft:

- innerhalb eines Requests bleibt die ID stabil
- Fehler-Handler und Endpoint-Logik können darauf zugreifen

### Fehlervertrag

`build_error_response(...)` soll nicht mehr zwangsläufig intern immer selbst eine neue UUID erzeugen. Stattdessen soll der Fehlerpfad bevorzugt die requestgebundene `correlation_id` verwenden. Nur wenn ausnahmsweise kein Request-Kontext vorhanden ist, ist eine lokale Fallback-ID akzeptabel.

### Persistenzpfad

Neu erzeugte Runs sollen ein zusätzliches persistiertes Feld `correlation_id` erhalten. Dadurch wird ein einzelner gespeicherter Run nicht nur über Prompt-/Modell-/Validierungsmetadaten erklärbar, sondern auch über die konkrete Request-Kennung, unter der er entstanden ist.

Dafür sind konsistent nachzuziehen:

- SQLAlchemy-Modell
- Repository-Signatur
- Alembic-Migration
- API-Response-Schema
- Workflow-Aufrufe aus dem API-Layer

### API-Sicht

Die öffentliche API für Analyse-Runs darf die `correlation_id` sichtbar machen. Das ist in diesem Projektkontext sinnvoll, weil die ID keine fachliche Geheimsemantik trägt, sondern eine rein technische Nachvollziehbarkeitsfunktion erfüllt.

## Risiken und Grenzen

- Diese Runde schafft keinen vollständigen Audit-Trail über Frontend, Backend, Persistenz und externe Provider hinweg; sie verbessert nur den Request-to-Run-Faden innerhalb des bestehenden MVP.
- Bestehende historische Runs ohne `correlation_id` müssen migrationsseitig sauber behandelt werden.
- Ohne zusätzliches Logging bleibt die ID vorerst vor allem für API- und Persistenzsicht nützlich, weniger für breit angelegte Betriebsdiagnose.

## Definition of Done

- jeder HTTP-Request erhält im Backend genau eine `correlation_id`
- Fehlerantworten verwenden dieselbe requestgebundene ID
- neue Runs persistieren die `correlation_id`
- Run-Responses geben die `correlation_id` mit aus
- Tests decken mindestens Fehlerpfad, erfolgreichen Run und Persistenzpfad ab
- die Doku zur Nachvollziehbarkeit wird dort geschärft, wo sich die technische Aussage real verändert
