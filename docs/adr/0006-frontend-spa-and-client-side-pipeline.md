# ADR-0006: Frontend als clientseitig gerenderte SPA

## Status

Accepted

## Date

2026-03-23

## Entscheidung

Das Frontend wird als clientseitig gerenderte Single-Page-Application mit React und Vite betrieben. Die UI wird statisch ausgeliefert; serverseitiges Rendering, serverseitige UI-Komposition und Streaming-Rendering werden fuer den MVP nicht eingesetzt.

Die Zustandsableitung der Analyse-Pipeline liegt im Browser. Nach einem synchronen API-Call auf `POST /api/v1/analyses` entfaltet das Frontend den bereits vollstaendig vorliegenden Analyse-Run deterministisch als clientseitigen Flow- und spaeteren Review-Modus.

## Kontext

Das Produkt zeigt eine didaktisch inszenierte Sechs-Stufen-Pipeline, deren Ablauf bewusst aus einem synchron gelieferten Analyse-Run abgeleitet wird. Die API liefert dabei den kompletten Run inklusive Metadaten und Analyse-JSON. Die Laufzeitinszenierung im Frontend soll reproduzierbar, testbar und ohne zusaetzliche Server-UI-Schicht bleiben.

Im lokalen Zielbetrieb wird das Frontend bereits statisch ueber Nginx ausgeliefert. Es existiert keine fachliche Anforderung an SEO, First-Byte-Optimierung oder serverseitige HTML-Personalisierung. Dagegen ist eine klar kontrollierte clientseitige Zustandsmaschine fuer den Reveal-Flow zentral fuer die UX.

## Konsequenzen

Positiv:

- Die Frontend-Laufzeit bleibt einfach: statische Assets, Browser-State und API-Aufrufe genuegen.
- Die deterministische Pipeline-Entfaltung bleibt vollstaendig im Frontend testbar und von Backend-Timing entkoppelt.
- Compose-Deployment und lokale Reproduzierbarkeit bleiben einfach, weil kein zusaetzlicher Node- oder SSR-Laufzeitprozess benoetigt wird.

Negativ:

- Kein SEO- oder SSR-Vorteil fuer initiales HTML.
- Die erste sinnvolle Darstellung der Analyse entsteht erst nach Laden der SPA im Browser.
- Die UI-Logik fuer Flow- und Review-Modus muss bewusst im Frontend gepflegt und dokumentiert werden.

## Betrachtete Alternativen

- Serverseitig gerenderte React-Anwendung mit SSR.
- Streaming-UI direkt aus dem Backend oder ueber serverseitige Events.
- Klassische Mehrseitenanwendung mit serverseitiger Template-Generierung.

## Begruendung

Die SPA-/CSR-Entscheidung passt am besten zum aktuellen Produktziel: eine lokal reproduzierbare, didaktisch gesteuerte Analyseoberflaeche mit klarer Trennung zwischen API-Vertrag und Frontend-Inszenierung. SSR oder Streaming wuerden fuer den MVP zusaetzliche Laufzeit- und Integrationskomplexitaet erzeugen, ohne einen fachlich noetigen Mehrwert zu liefern.
