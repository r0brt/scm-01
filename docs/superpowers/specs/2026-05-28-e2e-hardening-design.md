# E2E Hardening Design

## Ziel

Diese Runde haertet den bestehenden Playwright-Testpfad fuer UJ1, ohne den Produktumfang von SCM zu erweitern. Der vorhandene Journey-Test soll lokal robuster und klarer reproduzierbar werden, insbesondere im Zusammenspiel mit parallel genutzten Dev- und Compose-Ports.

## Ausgangslage

Der aktuelle Playwright-Flow startet Frontend und Backend ueber lokale Dev-Server. Das ist fuer den schlanken UJ1-Nachweis weiterhin passend, fuehrt lokal aber zu unnötigen Konflikten:

- das Backend wird im E2E-Setup auf `8000` gestartet, was mit dem normalen Backend-Dev-Betrieb und dem Compose-Stack kollidieren kann
- das Frontend laeuft bereits auf einem separaten Port `4174`, die Portstrategie ist aber nicht als bewusstes E2E-Schema dokumentiert
- der reproduzierbare Ablauf ist deshalb fuer Evaluations- und Re-Onboarding-Zwecke unnötig fragil

Zusätzlich bleibt der E2E-Test bewusst ein UI-/Journey-Test mit gemockter API. Diese Runde aendert daran nichts, sondern haertet nur den bestehenden Ausfuehrungspfad.

## Scope

In Scope:

- feste, separate E2E-Ports fuer Frontend und Backend
- optional per Umgebungsvariablen ueberschreibbare Port-Defaults
- Playwright-/Dev-Server-Konfiguration an diese Ports anpassen
- README und Testdokumentation auf den neuen Ablauf ziehen
- den lokalen E2E-Workflow als bewusst von Compose getrennten Testpfad beschreiben

Out of Scope:

- echte Backend-E2E-Tests ohne API-Mocking
- Produktlogik, UI oder API-Verhalten
- Traceability-/Logging-Haertung
- Diagramm- oder Reflexionsarbeit

## Designentscheidung

Die E2E-Haertung verwendet feste, dedizierte Test-Ports statt dynamischer Ports.

Begruendung:

- feste Ports sind leichter zu dokumentieren und manuell zu debuggen
- sie reduzieren Konflikte mit den normalen Dev-/Compose-Ports, ohne die Reproduktion unuebersichtlich zu machen
- fuer ein Studien- und Bewertungsrepo ist Vorhersagbarkeit wichtiger als maximale Automatisierung

Die Ports sollen deshalb bewusst vom Standardbetrieb getrennt sein:

- Frontend-E2E-Port: eigener dedizierter Port statt `4173`
- Backend-E2E-Port: eigener dedizierter Port statt `8000`

Die konkreten Defaults duerfen im Implementierungsplan festgelegt werden, sollen aber eindeutig als E2E-Ports erkennbar bleiben und optional per Env ueberschreibbar sein.

## Technische Leitlinien

### Playwright-Setup

`frontend/playwright.config.ts` bleibt der zentrale Einstiegspunkt fuer den E2E-Lauf. Dort werden die beiden lokal gestarteten Webserver weiterhin durch Playwright selbst verwaltet.

Die Konfiguration soll:

- eine konsistente `baseURL` auf den dedizierten Frontend-E2E-Port zeigen
- das Backend auf einem dedizierten E2E-Port starten
- dieselben Ports fuer Health-Check und Server-Start verwenden
- Portwerte zentral und nachvollziehbar aus Konfigurationswerten ableiten

### Frontend-Proxy fuer lokale E2E-Server

Wenn das Frontend im Dev-Modus API-Aufrufe weiterhin hart auf `127.0.0.1:8000` proxyt, muss diese Stelle auf eine konfigurierbare API-Basis fuer den lokalen Dev-/E2E-Betrieb umgestellt werden. Ziel ist, dass der E2E-Server nicht implizit vom normalen Backend-Port abhaengt.

Dabei soll die bestehende Entwicklerfreundlichkeit erhalten bleiben:

- normale lokale Entwicklung darf weiter ohne unnötige Zusatzschritte funktionieren
- E2E soll denselben Mechanismus nur mit eigenen Defaults oder Umgebungsvariablen verwenden

### Dokumentation und Nachweise

README und Testreport sollen danach konsistent ausdruecken:

- dass der Journey-Test lokale Dev-Server verwendet
- welche Browser-Voraussetzung Playwright lokal hat
- welche dedizierten Ports der E2E-Flow standardmaessig nutzt
- dass Port-Overrides moeglich sind
- dass der Testpfad weiterhin ein API-gemockter UJ1-Journey-Test bleibt

## Risiken und Grenzen

- Fehlende lokal installierte Playwright-Browser bleiben auch nach der Port-Haertung ein separater möglicher Blocker.
- Wenn weitere lokale Tools dieselben E2E-Ports verwenden, kann der Konflikt weiterhin auftreten; er wird nur deutlich unwahrscheinlicher und besser steuerbar.
- Diese Runde verbessert die Reproduzierbarkeit, ersetzt aber nicht die spaetere Frage nach einem echten End-to-End-Test gegen Backend und Persistenz.

## Definition of Done

- dedizierte E2E-Ports sind technisch in der lokalen Testkonfiguration verdrahtet
- normale Dev-/Compose-Ports werden fuer E2E nicht mehr stillschweigend vorausgesetzt
- README und Testreport nennen Browser-Voraussetzungen, Testcharakter und Port-Defaults klar
- der E2E-Lauf wird lokal erneut versucht; falls Browser fehlen, bleibt dies als ehrliche Restlimitation dokumentiert
- keine Produktlogik wurde geaendert
