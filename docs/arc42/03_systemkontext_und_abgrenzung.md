# 03 Systemkontext und -abgrenzung

## Systemabgrenzung

SCM umfasst im MVP das Frontend, die Backend-API und die lokale Persistenz der Analyse-Runs. Innerhalb dieser Systemgrenze nimmt das System vom Nutzer bereitgestellten Social-Media- oder Problemtext entgegen, führt eine strukturierte Analyse-Pipeline aus, validiert die Ergebnisstruktur und speichert beziehungsweise lädt Runs mit ihren Metadaten.

SCM ist dabei ein Analyse- und Unterstützungswerkzeug. Das System strukturiert Eingaben, macht Verarbeitungszustände sichtbar und liefert einen fachlich vorbereiteten Analysevorschlag. Es trifft jedoch keine autonomen Entscheidungen über Personen, Situationen oder organisatorische Massnahmen und ersetzt keine menschliche Beurteilung.

## Kontextdiagramm (textuell)

Als visuelle Ergänzung dient [docs/diagrams/system-context.puml](/Users/robert/code/scm-01/docs/diagrams/system-context.puml:1).

- Primärer Akteur ist der `User`. Er gibt den fachlichen Ausgangstext im `Frontend UI` ein, startet damit einen Analyse-Run und liest die erzeugten Resultate, Statusanzeigen und Fehlermeldungen wieder im UI.
- Der zentrale Eintrittspunkt für fachliche Daten ist das `Frontend UI`. Dort gelangt potenziell datenschutzsensitiver Freitext in das System und wird anschliessend per HTTP/JSON an das `Backend API` übergeben.
- Das `Backend API` bildet die innere Verarbeitungsgrenze des Systems. Es nimmt Eingaben entgegen, ergänzt technische Metadaten, orchestriert Validierung und Persistenz und steuert den optionalen Aufruf des externen KI-Pfads.
- Die lokale Persistenz gehört zur kontrollierten Systemumgebung von SCM. Im Compose-Zielbetrieb ist dies `PostgreSQL`; ausserhalb davon kann der aktuelle Standardpfad auch lokal auf SQLite zeigen. In diese Persistenz fliessen Run-Daten, Analyseergebnisse, Validierungsinformationen und Traceability-Metadaten zur späteren Anzeige und Nachvollziehbarkeit zurück.
- Daten verlassen die lokale Systemgrenze nur dort, wo das `Backend API` über den internen Adapter ein externes `LLM Provider API` anspricht. Dieser Schritt ist optional konfiguriert und macht den KI-Anbieter zu einer bewusst benannten externen Abhängigkeit.
- Die vom System ausgegebenen Resultate fliessen aus dem `Backend API` zurück an das `Frontend UI` und von dort an den `User`. Damit bleibt der letzte Interpretations- und Entscheidungsschritt ausdrücklich beim Menschen und nicht beim System.

## Kontext und Verantwortung

Die Systemgrenze von SCM endet bei der lokalen UI/API/DB-Kombination. Browser-Nutzung, menschliche Interpretation der Analyse und ein optional angebundener externer KI-Anbieter bilden den relevanten Umgebungskontext ausserhalb dieser Grenze.

Für Datenschutz-, Transparenz- und Governance-Annahmen ergänzt [docs/privacy-and-ai-governance.md](/Users/robert/code/scm-01/docs/privacy-and-ai-governance.md:1) dieses Kapitel. Das Zusatzdokument vertieft insbesondere Datenarten, externe Empfänger und MVP-Grenzen, während arc42 die primäre Architekturerzählung bleibt.

## Externe Schnittstellen (Konzeptstand)

- UI zu API: REST-Endpunkte über JSON.
- API zu DB: ORM + SQL-Migrationen.
- API zu LLM-Provider: Provider-SDK/HTTP hinter Adapter-Port.
