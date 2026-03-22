# 07 Verteilungssicht

Die initiale Deployment-Sicht bleibt bei einem containerisierten Setup aus UI, API und PostgreSQL via Docker Compose.

Fuer M3 ist die Persistenz im Backend bereits relational modelliert. Die API schreibt Analyse-Runs in eine `runs`-Tabelle; produktiv ist dafuer PostgreSQL vorgesehen. Die lokalen Persistenztests laufen weiterhin mit SQLite, um den Entwicklungs- und Testloop ohne externe Datenbank schnell zu halten.

Ab M5 bleibt die API weiterhin der einzige Einstiegspunkt fuer Analysen, delegiert die eigentliche Analyseerzeugung aber an einen austauschbaren LLM-Adapter. Fuer lokale und Test-Nutzung kann ein Stub-Adapter ohne Netz aktiv bleiben; produktiv ist eine OpenAI-basierte Implementierung vorgesehen.
