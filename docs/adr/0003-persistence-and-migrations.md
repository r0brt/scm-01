# ADR-0003: Persistenz und Migrationen

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Analyse-Runs werden relational mit SQLAlchemy 2 modelliert und ueber Alembic-Migrationen versioniert. PostgreSQL ist das Zielsystem fuer den Laufzeitbetrieb. Fuer schnelle lokale Persistenztests bleibt SQLite zulaessig.

## Kontext

Das System muss Runs mit Analyse-JSON, Validierungsreport und Traceability-Metadaten nachvollziehbar speichern. Gleichzeitig sollen Datenbankschema und Anwendungscode reproduzierbar weiterentwickelt werden, ohne implizite Tabellenerzeugung als dauerhaften Standard zu etablieren.

## Konsequenzen

Positiv:

- Datenmodell und Schemahistorie bleiben versioniert und auditiert.
- PostgreSQL passt zum Zielbetrieb und zur Compose-Topologie.
- SQLite ermoeglicht einen schnellen lokalen Testloop ohne externe Infrastruktur.

Negativ:

- Zwei Datenbankumgebungen bedeuten potenzielle Dialektunterschiede zwischen Test und Zielsystem.
- Alembic fuehrt zusaetzliche Pflege fuer Migrationen ein.

## Betrachtete Alternativen

- Reines SQLite in Entwicklung und Laufzeit.
- Implizite Tabellenerzeugung ohne Migrationswerkzeug.
- Dokumentenorientierte Persistenz statt relationalem Modell.

## Begründung

Die Kombination aus SQLAlchemy 2, Alembic und PostgreSQL liefert die noetige Nachvollziehbarkeit fuer Runs und passt zum Anspruch auf reproduzierbare Architektur. SQLite bleibt eine pragmatische Testhilfe, ohne das Zielsystem zu ersetzen.
