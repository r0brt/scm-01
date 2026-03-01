# ADR-0001: Architekturstil

## Status

Accepted

## Date

2026-03-01

## Entscheidung

Als initialer Architekturstil wird ein modularer Monolith mit klaren internen Modulgrenzen und expliziten Verträgen verwendet, um eine optionale spätere Extraktion zu ermöglichen.

## Kontext

Das Projekt startet als Solo-Umsetzung mit strengen Anforderungen an Reproduzierbarkeit, Vertragsvalidierung und Dokumentation. Für frühe Meilensteine ist geringe Betriebs- und Integrationskomplexität entscheidend, bei gleichzeitiger Evolvierbarkeit.

## Konsequenzen

Positiv:

- Schnellere Implementierung und Tests mit weniger verteilten Fehlermodi.
- Einfacheres lokales Setup und Debugging für milestone-basierte Lieferung.
- Höhere Konsistenz für Contract-First-Validierung und Persistenzlogik.

Negativ:

- Unabhängige Skalierung auf Service-Ebene wird zunächst vertagt.
- Modulgrenzen müssen aktiv gepflegt werden, um Kopplung zu vermeiden.

## Betrachtete Alternativen

- Microservices von Beginn an.
- Geschichteter Monolith ohne explizite Modulgrenzen.

## Warum initial keine Microservices

Microservices verursachen zusätzlichen operativen Aufwand (Netzwerkgrenzen, Deployment-Orchestrierung, verteilte Observability, zusätzliche Ausfallmodi), der bei aktueller Projektgröße und Teamkonstellation (solo) nicht gerechtfertigt ist. Die kurzfristigen Prioritäten Korrektheit, Reproduzierbarkeit und Contract-Reliability werden mit einem modularen Monolithen effektiver erreicht.
