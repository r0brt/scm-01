# KI-Reflexion

## Einsatz von Codex im Projekt

Codex wurde im Projekt vor allem für inkrementelle Umsetzung, Testableitung, Dokumentationsnachführung und reproduzierbare Git-/PR-Schritte eingesetzt. Der grösste Nutzen lag darin, Milestones klein zu schneiden, Änderungen direkt mit passenden Tests zu koppeln und die Architektur- und Projektdokumentation laufend mitzupflegen.

## Wo der Einsatz besonders geholfen hat

- schnelle Ableitung kleiner, reviewbarer Deliverables aus PRD und PLAN
- konsequente Verknüpfung von Implementierung, Verifikation und Dokumentation
- zügige Erstellung von Testfällen für Contract-, Validation-, Persistenz-, API-, E2E- und Compose-Nachweise
- saubere Nachführung von README, arc42 und PR-Beschreibungen parallel zur Implementierung

## Wo menschliche Prüfung wichtig blieb

- Scope-Entscheidungen pro Milestone und die Reihenfolge der Arbeitspakete
- Beurteilung, ob ein Milestone inhaltlich wirklich abgeschlossen ist
- Review von Architekturentscheidungen und ihrer Passung zum Kurskontext
- Freigabe der GitHub-PRs und finale Bewertung der Abgabereife

## Erkenntnisse aus dem Projektverlauf

Der Nutzen von KI war am höchsten, wenn der Arbeitsrahmen strikt war: klarer Milestone, klare DoD-Commands, kleine Branches und konsequente Selbst-Review. Sobald die Grenze zwischen Unit-, E2E- und Laufzeitkonfiguration unscharf wurde, traten reale Integrationsprobleme auf. Genau dort war die Kombination aus automatisierter Ausführung und menschlicher Entscheidung am wertvollsten.

## Fazit

Für dieses Projekt war KI kein Ersatz für technische Verantwortung, sondern ein Beschleuniger für reproduzierbare Engineering-Arbeit. Besonders stark war der Beitrag bei TDD-naher Umsetzung, Doku-Disziplin und schneller Rückkopplung zwischen Code, Tests und Architekturartefakten.
