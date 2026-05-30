# ADR-0002: Analysevertrag und Validierung

## Status

Accepted

## Date

2026-03-22

## Entscheidung

Die Analyseausgabe wird über einen strikten JSON-Contract mit sechs festen Ebenen modelliert. Validierung erfolgt in zwei Stufen: zuerst gegen JSON Schema, danach gegen Pydantic-Modelle. Bei Verstössen wird ein strukturierter Validierungsreport erzeugt. Eine bounded Repair-Funktion ist auf maximal zwei Versuche begrenzt und getestet, aber im aktuellen Standardworkflow nicht automatisch verdrahtet.

## Kontext

Die zentrale Produktfunktion basiert auf LLM-generierter Analyse. Ohne expliziten Contract wären Formatdrift, stillschweigende Feldabweichungen und schwer reproduzierbare Fehler wahrscheinlich. Gleichzeitig verlangt das Projekt nachvollziehbare Fehlsemantik statt heuristischer Fallbacks.

## Konsequenzen

Positiv:

- Analyseergebnisse sind für API, Persistenz und UI formal stabil.
- Fehler werden explizit dokumentiert und als Run-Metadaten persistiert.
- Tests können den Vertrag unabhängig vom eigentlichen Modellverhalten absichern.

Negativ:

- Der Contract begrenzt die Form der Ausgabe und erhöht den Anpassungsaufwand bei Schemaänderungen.
- Fachlich brauchbare, aber formal falsche Ausgaben werden im aktuellen Standardpfad explizit als Fehlerlauf persistiert; ein später aktivierter Repair-Pfad muss diese Grenze weiterhin sichtbar machen.

## Betrachtete Alternativen

- Nur Pydantic ohne separates JSON Schema.
- Freiere, nur prompt-basierte JSON-Ausgabe ohne strikte Validierung.
- Stille Fallback-Heuristiken im Fehlerfall.

## Begründung

Die Kombination aus JSON Schema, Pydantic und vorbereiteter bounded Repair verbindet Vertragstreue mit reproduzierbarer Fehlerbehandlung. Sie passt direkt zu den Guardrails aus PRD und AGENTS und trennt fachliche Analysequalität von technischer Gültigkeit. Der aktuelle Standardworkflow bevorzugt explizite Fehlerläufe gegenüber stiller automatischer Reparatur.
