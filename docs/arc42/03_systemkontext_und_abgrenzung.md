# 03 Systemkontext und -abgrenzung

## Systemabgrenzung

Das System nimmt vom Nutzer bereitgestellten Social-Media-Text entgegen, führt eine strukturierte Analyse-Pipeline aus, validiert Vertragskonformität und speichert/lädt Analyse-Runs.

## Kontextdiagramm (textuell)

Als visuelle Ergänzung dient [docs/diagrams/system-context.puml](/Users/robert/code/scm-01/docs/diagrams/system-context.puml:1).

- Akteur `User` interagiert mit dem `Frontend UI`, um Text einzureichen und Runs einzusehen.
- `Frontend UI` ruft das `Backend API` via HTTP/JSON auf.
- `Backend API` persistiert Run-Daten und Metadaten in `PostgreSQL`.
- `Backend API` ruft ein externes `LLM Provider API` über einen internen Adapter auf.
- `LLM Provider API` liegt außerhalb der Systemgrenzen und ist eine externe Abhängigkeit.

## Externe Schnittstellen (Konzeptstand)

- UI zu API: REST-Endpunkte über JSON.
- API zu DB: ORM + SQL-Migrationen.
- API zu LLM-Provider: Provider-SDK/HTTP hinter Adapter-Port.
