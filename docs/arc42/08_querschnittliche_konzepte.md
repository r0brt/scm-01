# 08 Querschnittliche Konzepte

## Analyse-Contract

Die Analyseausgabe folgt einem strikten JSON-Contract. Die sechs Ebenen sind fest vorgegeben: `beobachtungen`, `erklaerungen`, `emotionen`, `zuschreibungen`, `schlussfolgerungen`, `massnahmen`. Zusätzliche Felder sind nicht erlaubt. Vertiefte semantische Prüfungen erfolgen erst in den späteren Validierungs- und Repair-Milestones.

## Validierung und Repair

Die Backend-Validierung prüft Analyse-Payloads in zwei Stufen: zuerst gegen das JSON Schema, danach gegen die Pydantic-Modelle. Das Ergebnis ist ein strukturierter Validierungsreport mit Status, Fehlercode und Prüfschritten.

Bei ungültigen Payloads ist der Repair-Loop strikt begrenzt. Nach der initialen Prüfung sind höchstens zwei Reparaturversuche erlaubt. Schlägt auch der letzte Versuch fehl, endet der Lauf explizit mit `REPAIR_LIMIT_EXCEEDED`; es gibt keine stillen Fallbacks.

## Persistenz

Analyse-Runs werden relational in einer einzelnen Tabelle `runs` gespeichert. Persistiert werden Eingabetext, Analyse-JSON, Validierungsreport sowie die für Nachvollziehbarkeit relevanten Metadaten wie `prompt_version`, `model_id`, `run_status`, `validation_status` und Fehlerangaben.

Schemaaenderungen werden nicht implizit aus ORM-Modellen erzeugt, sondern ueber Alembic-Migrationen versioniert. Dadurch bleiben Datenbankstruktur und Anwendungsmodell reproduzierbar und auditiert.
