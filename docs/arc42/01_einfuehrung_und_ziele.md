# 01 Einführung und Ziele

## Zweck

Social Cleanup Machine analysiert frei formulierte Social-Media- oder Problemtexte und liefert eine strukturierte Auswertung über sechs feste Ebenen. Das System bewertet den Inhalt nicht und automatisiert keine Entscheidungen. Es stellt einen nachvollziehbaren Analyse-Rahmen für Diskussion, Einordnung und spätere Weiterarbeit bereit.

Der Schwerpunkt des aktuellen MVP liegt auf reproduzierbarer Verarbeitung, expliziten Verträgen und dokumentierter Nachvollziehbarkeit. Dazu gehören eine klar definierte JSON-Struktur, eine überprüfbare Verarbeitungskette, persistierte Run-Metadaten sowie eine Architektur, die den Übergang von lokaler Entwicklung zu einem containerisierten Zielbetrieb transparent macht.

## Stakeholder

- Endnutzer: geben Text ein und prüfen Analyseergebnisse.
- Maintainer: entwickelt Architektur und Betrieb mit geringem Risiko weiter.
- Reviewer: prüfen Reproduzierbarkeit, Nachvollziehbarkeit und die Konsistenz zwischen Architektur, Implementierung und Nachweisen.

## Qualitätsziele

Für den aktuellen Projektstand sind insbesondere folgende Qualitätsziele prägend:

- Nachvollziehbarkeit: Jeder Analyse-Run bleibt über technische und fachliche Randdaten erklärbar.
- Vertragstreue: Analyseausgaben sind nicht nur plausibel, sondern formal kontrollierbar.
- Reproduzierbarkeit: Setup, Testläufe und Betriebsmodus bleiben lokal wiederholbar.
- Begrenzte Komplexität: Architektur und Laufzeit bleiben für ein Solo-Projekt beherrschbar.
- Ehrliche Systemgrenzen: Datenschutz-, Governance- und Provider-Grenzen werden offengelegt und nicht implizit kaschiert.

## Top-Ziele

1. Verlässliche, vertragsbasierte Analyseergebnisse.
2. Reproduzierbare Ausführung und Testbarkeit.
3. Inkrementelle Lieferung auf Basis eines modularen Monolithen.

## Abgrenzung und Nicht-Ziele

Der MVP verfolgt bewusst nicht das Ziel, ein vollständiges Moderations-, Entscheidungs- oder Compliance-System bereitzustellen. Nicht Bestandteil des aktuellen Projektstands sind insbesondere:

- autonome fachliche Bewertung oder Priorisierung gesellschaftlicher Probleme
- produktionsreife Datenschutz- und Governance-Prozesse
- fein granularer Mehrbenutzer- oder Rollenbetrieb
- vollständige Ende-zu-Ende-Observability über alle technischen und organisatorischen Ebenen

Die Architektur und Dokumentation sollen deshalb vor allem den realen Systemstand verständlich machen und zeigen, welche Entscheidungen für den aktuellen Projektumfang bewusst getroffen wurden.
