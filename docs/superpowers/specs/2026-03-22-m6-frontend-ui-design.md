# M6 Frontend UI Design

## Ziel

M6 fuehrt ein nutzbares Frontend fuer SCM ein. Der Deliverable umfasst Eingabe eines Problemtexts, Darstellung eines Analyse-Runs als 6-stufige Pipeline, Run-Liste und JSON-Export.

## Kontext

M4 und M5 liefern bereits eine synchrone API fuer Analyse-Runs. Es fehlt aber noch die sichtbare Benutzeroberflaeche fuer UJ1 und UJ2.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M6
- `docs/prd.md`
- `backend/app/main.py`

## Scope

Enthalten:

- Frontend-Skeleton mit React + Vite + TypeScript
- Eingabeformular fuer Problemtext
- Analyse ausloesen ueber `POST /api/v1/analyses`
- Pipeline-Ansicht fuer die sechs Ebenen
- Run-Liste und Detailauswahl
- JSON-Export fuer den aktuell gewaelten Run

Nicht enthalten:

- Authentifizierung
- komplexes Routing
- Designsystem
- ausgefeilte Fehlerbehandlung fuer alle Randfaelle

## Fachliche Grundentscheidung

M6 bleibt bei einer einzelnen App-Seite mit drei klaren Zonen:

- Eingabe / Analyse starten
- aktuelle Pipeline-Ansicht
- Historie / Run-Liste

Damit wird die Nutzung direkt sichtbar, ohne die kleine App durch fruehe Routing- oder State-Architektur aufzublasen.

## UI-Struktur

### Analyse-Eingabe

- Textarea fuer den Problemtext
- Button zum Starten der Analyse
- einfacher Loading- und Fehlerstatus

### Pipeline-Ansicht

- sechs Karten oder Spalten fuer:
  - Beobachtungen
  - Erklaerungen
  - Emotionen
  - Zuschreibungen
  - Schlussfolgerungen
  - Massnahmen
- je Ebene: Zusammenfassung und Punkteliste

### Run-Liste

- Liste der bisherigen Runs
- Anzeige von Status und Zeitstempel
- Klick auf Run laedt die Detailansicht

### JSON-Export

- Export des aktuell geladenen Runs als JSON-Datei

## API-Nutzung

M6 nutzt nur die vorhandenen M4-Endpunkte:

- `POST /api/v1/analyses`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{id}`

Ein direkter Rerun-Button ist in M6 optional und nicht noetig fuer den ersten UI-Schritt.

## Teststrategie

M6 braucht mindestens:

1. Frontend-Rendering-Test fuer die Hauptansicht
2. Interaktionstest fuer Analyse-Start mit gemockter API
3. Build-Erfolg ueber Vite

## Dokumentationsfolgen

M6 aendert den sichtbaren Benutzerzugang. Deshalb werden mindestens:

- `README.md`
- `docs/arc42/05_bausteinsicht.md`
- `docs/arc42/07_verteilungssicht.md`

minimal nachgezogen.

## Definition of Done

M6 ist fertig, wenn:

- ein lauffaehiges Frontend unter `frontend/` existiert
- `cd frontend && npm run test -- --run` gruen ist
- `cd frontend && npm run build` gruen ist
- Analyse, Pipeline, Run-Liste und JSON-Export im UI sichtbar sind

## Risiken und Guardrails

- kein ueberzogenes Designsystem
- kein Frontend-State-Overengineering
- Backend-API bleibt die Quelle der Wahrheit
