# 07 Verteilungssicht

Die initiale Deployment-Sicht bleibt bei einem containerisierten Setup aus UI, API und PostgreSQL via Docker Compose.

Fuer M3 ist die Persistenz im Backend bereits relational modelliert. Die API schreibt Analyse-Runs in eine `runs`-Tabelle; produktiv ist dafuer PostgreSQL vorgesehen. Die lokalen Persistenztests laufen weiterhin mit SQLite, um den Entwicklungs- und Testloop ohne externe Datenbank schnell zu halten.
