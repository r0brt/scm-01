# Compliance and Architecture Hardening Design

## Ziel

Diese Phase macht SCM dokumentations- und architekturseitig abgabereifer, ohne das Produktverhalten zu erweitern. Der Schwerpunkt liegt auf Datenschutz, EU-AI-Act-Einordnung, belastbarer Nachvollziehbarkeit und einem substanziellen Ausbau der arc42-Dokumentation inklusive Reflexion.

## Kontext

Nach dem MVP-Freeze liegen Produkt, Testreport, Release-Baseline und ein gesicherter Git-Stand vor. Die zentrale Luecke liegt nicht mehr in fehlender Funktionalitaet, sondern in der Qualitaet der argumentativen und regulatorischen Dokumentation:

- Datenschutz ist im Repo technisch implizit, aber nicht explizit als Verarbeitungs- und Risikokonzept beschrieben
- die AI-Act-relevante Systemeinordnung, Transparenz und Governance sind nicht sauber hergeleitet
- Nachvollziehbarkeit ist technisch teilweise vorhanden, aber architektonisch noch nicht Ende-zu-Ende erklaert
- die arc42-Dokumentation ist inhaltlich brauchbar, erreicht aber noch nicht den angestrebten Umfang und Detaillierungsgrad fuer die Abgabe

Referenzen:

- `AGENTS.md`
- `PLAN.md`
- `docs/prd.md`
- `docs/arc42/README.md`
- `docs/ki-reflexion.md`
- `docs/releases/v0.1-mvp-freeze.md`

## Scope

Enthalten:

- Ausbau der bestehenden arc42-Kapitel zu Datenschutz, Governance, Nachvollziehbarkeit, Risiken und Qualitaetsszenarien
- ein zentrales Zusatzdokument fuer Datenschutz- und KI-Governance
- zusaetzliche textbasierte Diagrammquellen zur Systemkontext-, Laufzeit- und Container-Sicht
- Ausbau der KI-Reflexion im Lichte von Datenschutz, Governance und menschlicher Verantwortung
- klare Referenzen zwischen arc42 und Zusatzartefakten

Nicht enthalten:

- neue Produktfeatures
- neue API-Endpunkte oder Datenbankfelder
- juristische Vollbewertung im Sinn externer Rechtsberatung
- produktionsreife organisatorische oder vertragliche Controls ausserhalb des Repos

## Designentscheidungen

### 1. arc42 bleibt das Primaerdokument

Die Abgabe soll architektonisch aus einem klaren Hauptdokument lesbar bleiben. Deshalb werden die relevanten arc42-Kapitel direkt erweitert; Datenschutz, AI-Governance und Nachvollziehbarkeit werden nicht in Nebendokumente ausgelagert und dort versteckt.

### 2. Ein Zusatzdokument buendelt Governance-Details

Zusatzdetails zu Datenarten, Verarbeitungszwecken, Rollen, externen Diensten, Transparenzannahmen und offenen Governance-Grenzen werden in dem fokussierten Zusatzdokument `docs/privacy-and-ai-governance.md` gebuendelt.

arc42 referenziert dieses Dokument explizit aus den betroffenen Kapiteln. Dadurch bleibt arc42 lesbar, waehrend Detailargumente dennoch sauber dokumentiert sind.

### 3. Keine Pseudo-Juristik

Die Dokumentation soll nicht so tun, als wuerde das Repo eine formale Rechtspruefung ersetzen. Stattdessen beschreibt sie:

- den Systemcharakter
- die tatsaechlichen Datenfluesse
- die daraus folgenden Risiken und Pflichten
- die Annahmen und Grenzen des MVP

So bleibt die Argumentation ehrlich, belastbar und abgabefaehig.

### 4. Nachvollziehbarkeit wird als Architekturthema beschrieben

Die vorhandenen Traceability-Elemente wie `prompt_version`, `model_id`, `validation_report`, `run_status`, `validation_status`, `error_code` und `created_at` werden nicht nur erwaehnt, sondern als zusammenhaengende Nachvollziehbarkeitskette beschrieben.

Dabei wird auch explizit gemacht, was aktuell noch fehlt, etwa ein durchgaengiger Request-/Audit-Kontext ueber `correlation_id`, Logging und Persistenz hinweg.

### 5. Umfangsausbau erfolgt gezielt, nicht durch Fuelltext

Das Ziel `ca. 25-30 Seiten inkl. Reflexion` wird nicht durch Wiederholungen erreicht, sondern durch:

- staerkere Konkretion der Kapitel 2, 3, 7, 8, 10 und 11
- ein zentrales Governance-Dokument
- 2-3 zusaetzliche Diagramme
- eine vertiefte, aber fokussierte KI-Reflexion

## Geplante Artefakte

### Neue Dateien

- `docs/privacy-and-ai-governance.md`
- `docs/diagrams/system-context.puml`
- `docs/diagrams/uj1-sequence.puml`
- `docs/diagrams/container-view.puml`

### Zu erweiternde Dateien

- `docs/arc42/02_randbedingungen.md`
- `docs/arc42/03_systemkontext_und_abgrenzung.md`
- `docs/arc42/07_verteilungssicht.md`
- `docs/arc42/08_querschnittliche_konzepte.md`
- `docs/arc42/10_qualitaetsszenarien.md`
- `docs/arc42/11_technische_risiken.md`
- `docs/arc42/README.md`
- `docs/ki-reflexion.md`

## Dokumentationsstil

Die aus dieser Phase entstehenden Artefakte werden repo- und abgabeorientiert formuliert, nicht als Agenten- oder Workflow-Spur.

Das bedeutet insbesondere:

- keine Formulierungen wie `ergänzen`, `nachziehen`, `mit Codex erstellt`, `im Plan umsetzen` oder andere Meta-Hinweise auf den Entstehungsprozess
- keine Aufgabenformulierung aus Sicht eines Assistenten, sondern beschreibende Deliverables aus Sicht des Projekts
- arc42 sachlich, trocken und entscheidungsorientiert statt generisch oder werblich
- Reflexion persoenlicher, konkreter und erkennbar aus Projektperspektive statt in glatter KI-Prosa
- Unsicherheiten und Grenzen offen benennen, aber nicht in einer Weise, die nach KI-internem Arbeitsprotokoll klingt

## Inhaltliche Leitlinie pro Themenblock

### Datenschutz

Zu dokumentieren sind mindestens:

- welche Daten verarbeitet und gespeichert werden
- dass `input_text` potenziell personenbezogene Daten enthalten kann
- Zweck und Grenzen der Verarbeitung
- externer Empfaenger im OpenAI-Pfad
- Aufbewahrungs- und Loeschannahmen fuer den MVP
- Sicherheits- und Transparenzannahmen

### EU AI Act

Zu dokumentieren sind mindestens:

- plausible Systemeinordnung fuer das SCM-MVP
- warum das Repo aktuell nicht als vollstaendig produktionsreifes Compliance-System behauptet wird
- welche Transparenz- und Governance-Erwartungen fuer dieses System relevant erscheinen
- welche menschliche Ueberpruefung vorgesehen ist

Die Formulierung bleibt bewusst als Architektur- und Governance-Einordnung, nicht als formelle Rechtsberatung.

### Nachvollziehbarkeit

Zu dokumentieren sind mindestens:

- welche technischen Felder bereits nachvollziehbare Runs ermoeglichen
- wo der Nachvollziehbarkeitsfaden beginnt und endet
- welche Luecken zwischen API-Fehlern, Audit-Kontext und Persistenz bestehen
- wie ein Evaluator einen Run heute nachvollziehen kann

### Reflexion

Die Reflexion wird ueber den reinen Arbeitsprozess hinaus vertieft um:

- Grenzen von KI-generierten Ergebnissen
- Rolle menschlicher Kontrolle
- Umgang mit Datenschutz- und Governance-Fragen im Projekt
- Einsicht, wo KI hilfreich war und wo sie bewusst nicht entscheiden durfte

## Verifikation

Diese Phase ist abgeschlossen, wenn:

- die genannten arc42-Kapitel substanziell erweitert und wechselseitig konsistent sind
- das neue Governance-Dokument existiert und aus arc42 referenziert wird
- die neuen Diagrammquellen vorhanden und aus den passenden Kapiteln referenziert sind
- die Reflexion inhaltlich vertieft wurde
- die Gesamtdokumentation fuer arc42 plus Reflexion plausibel auf den Zielumfang waechst

Da diese Phase bewusst dokumentationslastig bleibt, stehen keine neuen Produkt- oder API-Tests im Mittelpunkt. Relevante Verifikation ist hier primaer Konsistenz, Nachvollziehbarkeit und Vollstaendigkeit der Dokumentation.

## Risiken und Guardrails

- keine inhaltliche Vermischung mit Produktfeatures oder technischen Refactors
- keine simulierte juristische Endgueltigkeit; Unsicherheiten und Grenzen werden offen benannt
- keine unkontrollierte Nebendokumentation ohne klare arc42-Referenzen
- keine rein mechanische Umfangserhoehung ohne zusaetzliche Aussagekraft
- bestehende Produktbaseline und Freeze-Artefakte bleiben unberuehrt
