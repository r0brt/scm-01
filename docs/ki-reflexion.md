# KI-Reflexion

## Einsatz von Codex im Projekt

Codex wurde im Projekt vor allem fuer inkrementelle Umsetzung, Testableitung, Dokumentationsnachfuehrung und reproduzierbare Git-/PR-Schritte eingesetzt. Der groesste Nutzen lag darin, Milestones klein zu schneiden, Aenderungen direkt mit passenden Tests zu koppeln und die Architektur- und Projektdokumentation laufend mitzupflegen.

## Wo der Einsatz besonders geholfen hat

- schnelle Ableitung kleiner, reviewbarer Deliverables aus PRD und PLAN
- konsequente Verknuepfung von Implementierung, Verifikation und Dokumentation
- zuegige Erstellung von Testfaellen fuer Contract-, Validation-, Persistenz-, API-, E2E- und Compose-Nachweise
- saubere Nachfuehrung von README, arc42 und PR-Beschreibungen parallel zur Implementierung

## Wo menschliche Pruefung wichtig blieb

- Scope-Entscheidungen pro Milestone und die Reihenfolge der Arbeitspakete
- Beurteilung, ob ein Milestone inhaltlich wirklich abgeschlossen ist
- Review von Architekturentscheidungen und ihrer Passung zum Kurskontext
- Freigabe der GitHub-PRs und finale Bewertung der Abgabereife

## Erkenntnisse aus dem Projektverlauf

Der Nutzen von KI war am hoechsten, wenn der Arbeitsrahmen strikt war: klarer Milestone, klare DoD-Commands, kleine Branches und konsequente Selbst-Review. Sobald die Grenze zwischen Unit-, E2E- und Laufzeitkonfiguration unscharf wurde, traten reale Integrationsprobleme auf. Genau dort war die Kombination aus automatisierter Ausfuehrung und menschlicher Entscheidung am wertvollsten.

## Fazit

Fuer dieses Projekt war KI kein Ersatz fuer technische Verantwortung, sondern ein Beschleuniger fuer reproduzierbare Engineering-Arbeit. Besonders stark war der Beitrag bei TDD-naher Umsetzung, Doku-Disziplin und schneller Rueckkopplung zwischen Code, Tests und Architekturartefakten.
