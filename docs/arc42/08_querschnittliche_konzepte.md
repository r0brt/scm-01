# 08 Querschnittliche Konzepte

## Analyse-Contract

Die Analyseausgabe folgt einem strikten JSON-Contract. Die sechs Ebenen sind fest vorgegeben: `beobachtungen`, `erklaerungen`, `emotionen`, `zuschreibungen`, `schlussfolgerungen`, `massnahmen`. Zusätzliche Felder sind nicht erlaubt. Vertiefte semantische Prüfungen erfolgen erst in den späteren Validierungs- und Repair-Milestones.

## Validierung und Repair

Die Backend-Validierung prüft Analyse-Payloads in zwei Stufen: zuerst gegen das JSON Schema, danach gegen die Pydantic-Modelle. Das Ergebnis ist ein strukturierter Validierungsreport mit Status, Fehlercode und Prüfschritten.

Bei ungültigen Payloads ist der Repair-Loop strikt begrenzt. Nach der initialen Prüfung sind höchstens zwei Reparaturversuche erlaubt. Schlägt auch der letzte Versuch fehl, endet der Lauf explizit mit `REPAIR_LIMIT_EXCEEDED`; es gibt keine stillen Fallbacks.

## Persistenz

Analyse-Runs werden relational in einer einzelnen Tabelle `runs` gespeichert. Persistiert werden Eingabetext, Analyse-JSON, Validierungsreport sowie die für Nachvollziehbarkeit relevanten Metadaten wie `prompt_version`, `model_id`, `run_status`, `validation_status` und Fehlerangaben.

Schemaaenderungen werden nicht implizit aus ORM-Modellen erzeugt, sondern ueber Alembic-Migrationen versioniert. Dadurch bleiben Datenbankstruktur und Anwendungsmodell reproduzierbar und auditiert.

## API-Fehlervertrag

Die API mappt fachliche und technische Fehler zentral auf einen einheitlichen Fehlervertrag. Fehlerantworten enthalten immer `code`, `message`, `details` und eine generierte `correlation_id`.

In M4 werden mindestens ungueltige Requests und unbekannte Analyse-IDs explizit ueber diesen Vertrag beantwortet. Dadurch bleibt das Verhalten fuer Frontend und spaetere Integrationen stabil, auch wenn sich interne Implementierungen aendern.

## LLM-Adapter und Prompt-Versionierung

Die Analyseerzeugung erfolgt nicht direkt in der API oder im Workflow-Code, sondern ueber einen expliziten Adapter-Port. Dadurch bleiben Stub-, Test- und spaetere Provider-Implementierungen austauschbar.

Prompts werden versioniert unter `prompts/v1/` abgelegt. Der vom Adapter verwendete `prompt_version`-Wert und die `model_id` werden in jedem Run persistiert, damit die Herkunft einer Analyse nachvollziehbar bleibt.
