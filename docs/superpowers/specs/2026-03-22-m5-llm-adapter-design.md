# M5 LLM Adapter and Prompt Versioning Design

## Ziel

M5 ersetzt die bisher harte Stub-Analyseerzeugung durch eine explizite Adapter-Schnittstelle. Der Deliverable umfasst ein LLM-Port-Interface, eine OpenAI-Implementierung, Prompt-Versionierung unter `prompts/v1/` und eine DI-faehige Integration in den bestehenden Analyse-Workflow.

## Kontext

M4 hat API, Validation und Persistenz bereits verbunden, arbeitet aber noch mit einer eingebetteten Stub-Analyse. M5 macht die Analyseerzeugung austauschbar, ohne Tests von Netzwerkzugriffen abhaengig zu machen.

Referenzen:

- `AGENTS.md`
- `PLAN.md` M5
- `docs/prd.md`
- `backend/app/services/analysis_workflow.py`
- `backend/app/main.py`

## Scope

Enthalten:

- LLM-Adapter-Interface
- Default-Stub-Adapter fuer lokale und Test-Nutzung
- OpenAI-Adapter-Implementierung hinter dem Interface
- Prompt-Datei unter `prompts/v1/`
- Integration des Adapters in Analyse- und Rerun-Workflow
- Tests ohne Netz, Adapter via Mocks/Fakes

Nicht enthalten:

- echte Netzwerk-Integration in Tests
- Prompt-Optimierung ueber mehrere Versionen
- vollstaendige Retry-/Repair-Delegation an den Provider

## Fachliche Grundentscheidung

Die Anwendung kennt im Workflow nur noch einen Port, der aus Eingabetext und Prompt eine Analyse-Payload liefert. Welche Implementierung dahinter steckt, wird von der App-Konfiguration entschieden.

Dadurch kann M4-Stubbing weiter als Default dienen, waehrend M5 parallel eine echte OpenAI-Implementierung vorbereitet.

## Adapter-Schnitt

Der Port soll mindestens zurueckgeben:

- `payload` als rohes Analyse-JSON
- `model_id`
- `prompt_version`

Der Workflow persistiert genau diese Traceability-Felder weiter im Run.

## Prompt-Versionierung

Prompts liegen unter:

- `prompts/v1/analysis.md`

Die Prompt-Version ist in M5 `v1` und wird explizit in Runs persistiert. Die OpenAI-Implementierung liest den Prompt aus diesem Pfad, statt ihn im Code zu verstecken.

## OpenAI-Adapter

Die echte Implementierung bleibt in M5 ein austauschbarer Adapter:

- erwartet API-Key aus Umgebungsvariable
- liest Prompt-Text aus `prompts/v1/analysis.md`
- gibt Analyse-Payload und Modellmetadaten zurueck

Die Tests verwenden diese Implementierung nicht fuer echte Requests.

## Teststrategie

M5 fuehrt oder erweitert Tests fuer:

1. Workflow nutzt injizierten Fake-Adapter
2. persistierter Run uebernimmt `prompt_version` und `model_id` aus dem Adapter
3. API bleibt ohne Netz funktionsfaehig, wenn ein Stub-/Fake-Adapter injiziert wird

## Dokumentationsfolgen

M5 aendert LLM-Integration und Konfiguration. Deshalb werden mindestens:

- `docs/arc42/08_querschnittliche_konzepte.md`
- `docs/arc42/07_verteilungssicht.md`

minimal nachgezogen.

## Definition of Done

M5 ist fertig, wenn:

- ein LLM-Port und eine OpenAI-Implementierung existieren
- `prompts/v1/analysis.md` existiert
- Tests ohne Netz laufen und den Adapter mocken
- `prompt_version=v1` und `model_id` weiterhin persistiert werden

## Risiken und Guardrails

- kein versteckter direkter OpenAI-Call im Workflow
- keine Netzaufrufe in Tests
- Prompt-Text nicht im Python-Code duplizieren
