# M9 Finalization Design

## Ziel

M9 fuehrt SCM in einen abgabefaehigen Endzustand. Der Schwerpunkt liegt nicht mehr auf neuer Produktfunktionalitaet, sondern auf konsistenter Abschlussdokumentation, finalen Verifikationsnachweisen und einer expliziten Abnahme- und Reflexionsspur.

## Kontext

Nach M8 liegen Backend, Persistenz, API, Frontend, Integrationsnachweise und Compose-Betrieb auf `main` vor. Der verbleibende Planpunkt ist die Finalisierung gemaess `PLAN.md`: Doku-Freeze, Abnahmecheckliste, KI-Reflexion und eine finale Verifikationsrunde.

Aktuelle Befunde:

- `docs/test-report.md` dokumentiert bisher nur M7-Integration und E2E, nicht den finalen Gesamtstand
- `docs/arc42/10_qualitaetsszenarien.md` und `docs/arc42/11_technische_risiken.md` sind noch Platzhalter
- eine explizite Abnahmecheckliste und eine kurze KI-Reflexion fehlen noch als eigenstaendige Artefakte

Referenzen:

- `AGENTS.md`
- `PLAN.md` M9
- `docs/prd.md`
- `README.md`
- `docs/arc42/README.md`
- `docs/test-report.md`

## Scope

Enthalten:

- finale Verifikationslaeufe fuer Backend, Frontend und Compose
- Nachfuehrung von `docs/test-report.md` auf den finalen Projektstand
- Konkretisierung von arc42 Kapitel 10 und 11
- neue Abnahmecheckliste
- neue kurze KI-Reflexion

Nicht enthalten:

- neue Produktfeatures
- Service-Extraktion
- neue Infrastruktur ausser bereits vorhandenem Compose-Betrieb

## Designentscheidungen

### 1. Finalisierung bleibt dokumentationsgetrieben

M9 veraendert das Produktverhalten nicht. Alle Aenderungen liegen in Dokumentation, Nachweis und Reproduzierbarkeit. Dadurch bleibt der Milestone klein und risikoarm.

### 2. Testreport wird zum zentralen Abschlussnachweis

`docs/test-report.md` wird vom M7-spezifischen Nachweis auf einen finalen Projekt-Testreport erweitert. Er dokumentiert nur tatsaechlich ausgefuehrte Befehle und ihre Resultate.

### 3. arc42-Platzhalter werden minimal, aber konkret ersetzt

Kapitel 10 und 11 werden nicht breit theoretisch ausgebaut, sondern auf den realen SCM-Stand gebracht:

- Qualitaetsszenarien entlang von Contract-Treue, Nachvollziehbarkeit und lokal reproduzierbarem Betrieb
- technische Risiken entlang von Stub-vs-Provider, Compose-vs-Produktivbetrieb und begrenztem E2E-Coverage

### 4. Abschlussartefakte bleiben klein und pruefbar

Die Abnahmecheckliste und die KI-Reflexion werden als kurze, eigenstaendige Dokumente abgelegt. So bleibt der Abgabestand lesbar, statt README oder PRD mit Abschlussmeta zu ueberladen.

## Betroffene Dateien

- Modify: `README.md`
- Modify: `docs/test-report.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `docs/arc42/11_technische_risiken.md`
- Create: `docs/acceptance-checklist.md`
- Create: `docs/ki-reflexion.md`

## Verifikation

Die finalen Nachweise fuer M9 sind:

```bash
cd backend && uv run pytest -q
cd frontend && npm run test -- --run
cd frontend && npm run build
docker compose up -d
docker compose ps
docker compose down
```

Die Resultate dieser realen Commands werden in `docs/test-report.md` dokumentiert.

## Risiken und Guardrails

- keine erfundenen Testresultate; nur real ausgefuehrte Commands dokumentieren
- keine neuen Produktfeatures in M9
- arc42 weiter knapp halten, aber Platzhalter entfernen
- Compose nach Verifikation wieder sauber herunterfahren
