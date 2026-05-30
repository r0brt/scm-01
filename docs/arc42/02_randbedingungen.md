# 02 Randbedingungen

## Technische Randbedingungen

- Backend-Stack: Python + FastAPI.
- Persistenz-Basis: SQLAlchemy 2 + Alembic + PostgreSQL.
- Frontend-Basis: React + Vite + TypeScript.
- Python-Tooling: `uv`; Frontend-Tooling: `npm`.

## Prozess-Randbedingungen

- Contract-First-Entwicklung für Analyse-Payloads.
- Docs-as-code mit arc42- und ADR-Updates bei architekturrelevanten Änderungen.
- Verbindliche Tests und reproduzierbare Commands pro Meilenstein.

## Organisatorische Randbedingungen

- Solo-Projekt-Workflow mit kurzlebigen Branches.
- Kleine, klar abgegrenzte Changes statt grosser Pakete.
- arc42 bleibt das Primärdokument der Architektur; ergänzende Governance-Dokumente präzisieren Annahmen, ersetzen aber keine Architekturbegründung.
- Der aktuelle Stand ist ein bewusst begrenzter MVP-Nachweis, kein ausformuliertes Betriebsmodell für produktiven Dauereinsatz.

## Fachliche und Governance-Randbedingungen

SCM verarbeitet frei eingegebenen Problemtext. Dieser Text kann personenbezogene, sensible oder anderweitig heikle Informationen enthalten und ist deshalb als datenschutzrelevante Eingabe zu behandeln, nicht als technisch neutraler Testinhalt.

Die Analysefunktion kann über einen externen KI-Anbieter laufen. Diese Abhängigkeit muss architektonisch sichtbar bleiben, weil dabei Eingabetext, Prompt-Kontext und Schema-Vorgaben die lokale Systemgrenze verlassen können.

Transparenz ist eine zentrale Systemerwartung. Nutzende sollen erkennen können, dass Resultate aus einer nachvollziehbaren Pipeline mit Modell-, Prompt- und Validierungskontext entstehen und nicht aus einer intransparenten Blackbox ohne Herkunftshinweise.

SCM ist im MVP auf unterstützende Analyse und Strukturierung ausgelegt. Weder Rollenmodell, ausgereifte Löschprozesse noch ein vollständiger Audit- und Compliance-Betrieb sind Teil des aktuellen Lieferumfangs. Die Architektur beschreibt deshalb den realen Systemstand und vermeidet Behauptungen über rechtliche Vollständigkeit oder abschliessend nachgewiesene Konformität.
