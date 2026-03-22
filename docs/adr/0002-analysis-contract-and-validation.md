# ADR-0002: Analysevertrag und Validierung

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Die Analyseausgabe wird ueber einen strikten JSON-Contract mit sechs festen Ebenen modelliert. Validierung erfolgt in zwei Stufen: zuerst gegen JSON Schema, danach gegen Pydantic-Modelle. Bei Verstoessen wird ein strukturierter Validierungsreport erzeugt; ein Repair-Loop ist auf maximal zwei Versuche begrenzt.

## Kontext

Die zentrale Produktfunktion basiert auf LLM-generierter Analyse. Ohne expliziten Contract waeren Formatdrift, stillschweigende Feldabweichungen und schwer reproduzierbare Fehler wahrscheinlich. Gleichzeitig verlangt das Projekt nachvollziehbare Fehlsemantik statt heuristischer Fallbacks.

## Konsequenzen

Positiv:

- Analyseergebnisse sind fuer API, Persistenz und UI formal stabil.
- Fehler werden explizit dokumentiert und als Run-Metadaten persistiert.
- Tests koennen den Vertrag unabhaengig vom eigentlichen Modellverhalten absichern.

Negativ:

- Der Contract begrenzt die Form der Ausgabe und erhoeht den Anpassungsaufwand bei Schemaaenderungen.
- Fachlich brauchbare, aber formal falsche Ausgaben werden verworfen oder in den Repair-Pfad gezwungen.

## Betrachtete Alternativen

- Nur Pydantic ohne separates JSON Schema.
- Freiere, nur prompt-basierte JSON-Ausgabe ohne strikte Validierung.
- Stille Fallback-Heuristiken im Fehlerfall.

## Begründung

Die Kombination aus JSON Schema, Pydantic und bounded Repair verbindet Vertragstreue mit reproduzierbarer Fehlerbehandlung. Sie passt direkt zu den Guardrails aus PRD und AGENTS und trennt fachliche Analysequalitaet von technischer Gueltigkeit.
