# 03 Systemkontext und -abgrenzung

## Systemabgrenzung

SCM umfasst im MVP das Frontend, die Backend-API und die lokale Persistenz der Analyse-Runs. Innerhalb dieser Systemgrenze nimmt das System vom Nutzer bereitgestellten Social-Media- oder Problemtext entgegen, führt eine strukturierte Analyse-Pipeline aus, validiert die Ergebnisstruktur und speichert beziehungsweise lädt Runs mit ihren Metadaten.

SCM ist dabei ein Analyse- und Unterstützungswerkzeug. Das System strukturiert Eingaben, macht Verarbeitungszustände sichtbar und liefert einen fachlich vorbereiteten Analysevorschlag. Es trifft jedoch keine autonomen Entscheidungen über Personen, Situationen oder organisatorische Massnahmen und ersetzt keine menschliche Beurteilung.

## Kontextdiagramm (textuell)

Als visuelle Ergänzung dient [docs/diagrams/system-context.puml](/Users/robert/code/scm-01/docs/diagrams/system-context.puml:1). Die C1-Sicht ist zusätzlich als Structurizr-Quelle in [docs/diagrams/structurizr/c1-system-context.dsl](/Users/robert/code/scm-01/docs/diagrams/structurizr/c1-system-context.dsl:1) dokumentiert.

Die C1-Sicht zeigt SCM als ein System innerhalb einer bewusst engen Systemgrenze. Innerhalb dieser Grenze liegen Web UI, Backend/API und lokale Persistenz; ausserhalb liegen die menschliche Nutzung und der optionale externe LLM Provider. Diese Sicht ist wichtig, weil sie die KI-Abhängigkeit nicht als internes Detail versteckt, sondern als bewusst benanntes Umsystem ausweist.

- Primärer Akteur ist der `User`. Er gibt den fachlichen Ausgangstext über die SCM-Oberfläche ein, startet damit einen Analyse-Run und liest die erzeugten Resultate, Statusanzeigen und Fehlermeldungen wieder aus dem System.
- Auf Ebene des Systemkontexts erscheint `SCM` bewusst als Blackbox. Frontend, Backend und lokale Persistenz gehören innerhalb dieser Abstraktion zur internen Systemgrenze und werden nicht als eigene Umsysteme modelliert.
- Der zentrale Eintrittspunkt für fachliche Daten ist damit das Gesamtsystem `SCM`. Dort gelangt potenziell datenschutzsensitiver Freitext in die interne Verarbeitungskette aus UI, API, Validierung und Persistenz.
- Daten verlassen die lokale Systemgrenze nur dort, wo `SCM` über den internen Adapter ein externes `LLM Provider API` anspricht. Dieser Schritt ist optional konfiguriert und macht den KI-Anbieter zu einer bewusst benannten externen Abhängigkeit.
- Die vom System ausgegebenen Resultate fliessen aus `SCM` zurück an den `User`. Damit bleibt der letzte Interpretations- und Entscheidungsschritt ausdrücklich beim Menschen und nicht beim System.

## Kontext und Verantwortung

Die Systemgrenze von SCM endet bei der lokalen UI/API/DB-Kombination. Browser-Nutzung, menschliche Interpretation der Analyse und ein optional angebundener externer KI-Anbieter bilden den relevanten Umgebungskontext ausserhalb dieser Grenze.

Für Datenschutz-, Transparenz- und Governance-Annahmen ergänzt [docs/privacy-and-ai-governance.md](/Users/robert/code/scm-01/docs/privacy-and-ai-governance.md:1) dieses Kapitel. Das Zusatzdokument vertieft insbesondere Datenarten, externe Empfänger und MVP-Grenzen, während arc42 die primäre Architekturerzählung bleibt.

## Externe Schnittstellen (MVP-Stand)

- UI zu API: REST-Endpunkte über JSON.
- API zu DB: ORM + SQL-Migrationen.
- API zu LLM-Provider: Provider-SDK/HTTP hinter Adapter-Port.
