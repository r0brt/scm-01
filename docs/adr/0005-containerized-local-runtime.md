# ADR-0005: Containerisierter lokaler Zielbetrieb

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Der lokale Zielbetrieb wird ueber Docker Compose mit drei Containern bereitgestellt: `frontend`, `api` und `db`. Das Frontend wird statisch via Nginx ausgeliefert und leitet `/api` an das Backend weiter. Die API fuehrt beim Start `alembic upgrade head` gegen PostgreSQL aus.

## Kontext

Das Projekt braucht einen reproduzierbaren, verteilten MVP-Betrieb, ohne bereits in Microservices oder komplexere Deployment-Infrastruktur zu kippen. Gleichzeitig sollen Frontend, API und Datenbank in ihrer Laufzeitkopplung sichtbar und lokal pruefbar sein.

## Konsequenzen

Positiv:

- Der geforderte verteilte Mindestbetrieb ist lokal reproduzierbar.
- Frontend, API und DB bleiben sauber als Laufzeitbausteine getrennt.
- Datenbankschema und Containerstart werden ueber denselben Compose-Flow verifiziert.

Negativ:

- Compose deckt keine produktionsnahen Themen wie TLS, Secret-Management oder Observability ab.
- Container-Start und Image-Build erhoehen den lokalen Verifikationsaufwand.

## Betrachtete Alternativen

- Nur lokale Dev-Server ohne Container.
- Frontend und Backend in einem gemeinsamen Container.
- Fruehe Aufteilung in mehrere Services mit separater Orchestrierung.

## Begründung

Docker Compose trifft den geforderten Mittelweg aus Verteilung, Reproduzierbarkeit und geringer Komplexitaet. Die drei Container bilden die reale Zieltopologie des MVP ab, ohne fuer ein Solo-Projekt unnötige operative Last einzufuehren.
