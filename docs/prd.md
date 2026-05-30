# PRD — Social Clean-Up Machine (SCM)

* Version: 0.1
* Owner: Robert Hämmerli
* Date: 2026-03-01

## 1. Kontext & Problem

Öffentliche und organisatorische Diskussionen vermischen oft Symptome, Ursachenannahmen, Emotionen, Narrative und vereinfachende Zuschreibungen. Dadurch entstehen Missverständnisse, verkürzte Schlussfolgerungen und Massnahmen, die nicht am Kern eines Problems ansetzen.

SCM adressiert das Bedürfnis, frei formulierte Problemtexte systematisch zu entflechten und argumentative Ebenen transparent zu trennen.

## 2. Vision

SCM ist ein Instrument zur strukturellen Klärung komplexer gesellschaftlicher Problemstellungen. Die Applikation trennt argumentative Ebenen sichtbar voneinander, ohne den Inhalt zu bewerten. Ziel ist Nachvollziehbarkeit und Differenzierung in Analyse, Diskussion und Entscheidungsfindung.

## 3. Ziele (Outcomes)

* **G1 — Strukturierte Entflechtung:** Ein Problemtext wird in sechs Ebenen zerlegt, sodass Vermischungen sichtbar werden. Die Ebenen heissen fix: `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`.
* **G2 — Reproduzierbarkeit:** Analyse erfolgt in einer geführten, überprüfbaren Verarbeitungskette (nicht als einmalige Chat-Antwort).
* **G3 — Weiterverarbeitbarkeit:** Resultate sind maschinenlesbar (JSON) und persistierbar.
* **G4 — Didaktische Darstellung:** Die Ebenen werden als Filter-/Reinigungsstrecke visuell nachvollziehbar dargestellt.

## 4. Nicht-Ziele (Explizit)

* **NG1:** Keine inhaltliche Bewertung (keine „Wahrheit“, kein Fact-Checking).
* **NG2:** Keine politische Positionierung oder Empfehlung von Massnahmen.
* **NG3:** Kein vollwertiges Diskursanalyse-Forschungstool (z. B. Korpus, Quellenvergleich) im MVP.
* **NG4:** Keine Benutzerverwaltung/Mehrmandantenfähigkeit im MVP.

## 5. Zielgruppen & Stakeholder

* **Primary:** Studierende & Lehrpersonen (didaktische Argumentations-/Diskursanalyse)
* **Secondary:** Organisationen (strukturiertes Aufarbeiten von Problemtexten), Fachpersonen KI-gestützte SWE (Demonstrator)
* **Tertiary:** Bildungsinstitutionen (Seminar-/Methodentraining)

## 6. User Journeys (MVP)

* **UJ1 — Analyse eines Problemtexts**

  1. Nutzer erfasst Problemtext.
  2. System führt Analysepipeline aus (6 Ebenen).
  3. System validiert Output (Schema + Konsistenz).
  4. System zeigt Resultate als Filterstrecke.
  5. System speichert Input + Resultat + Metadaten.

* **UJ2 — Wiederfinden**

  1. Nutzer öffnet eine Liste vergangener Läufe.
  2. Nutzer öffnet Detailansicht eines Laufs (Input, Output, Validierungsreport, Metadaten).

* **UJ3 — Rerun**

  1. Nutzer wählt einen bestehenden Lauf.
  2. System erzeugt **einen neuen Lauf** mit gleichem Input und aktuellen Konfigurationen (z. B. Prompt-Version).
  3. Beide Läufe bleiben unverändert erhalten (Immutable Runs).

## 7. Use Cases (MVP)

* **UC1 — Problemtext erfassen**
* **UC2 — Schichtenanalyse durchführen (6 Ebenen)**
* **UC3 — Ergebnis validieren & Repair-Grenze behandeln**

  * Schema-Validierung (strict)
  * Konsistenzchecks
  * Aktueller Standardpfad: Contract-Verletzungen werden als `failed` persistiert; bounded Repair ist als Guardrail vorbereitet, aber nicht automatisch verdrahtet.
* **UC4 — Ergebnis anzeigen (Filterstrecke)**
* **UC5 — Persistieren & abrufen**

  * Speichern: Input + Resultat + Metadaten + Validierungsreport
  * Abrufen: Liste + Detailansicht

## 8. Functional Requirements (MVP)

* **FR1:** API Endpoint zur Analyse (synchron).
* **FR2:** Striktes JSON Output-Format (Contract).
* **FR3:** Schema-Validierung vor Persistenz.
* **FR4:** Bounded Repair ist als Guardrail für Contract-Verletzungen vorbereitet (max. 2 Retries); der aktive Standardpfad persistiert ungültige Payloads explizit als `failed`.
* **FR5:** Speicherung in relationaler DB.
* **FR6:** UI zeigt die 6 Stufen als Pipeline (Filterstrecke).
* **FR7:** Anzeige der Metadaten (Prompt-Version, Modell, Timestamp, Status).
* **FR8:** JSON Export pro Lauf (Download).
* **FR9:** Rerun Endpoint erzeugt neuen Lauf (Immutable Runs).

## 9. Qualitätsanforderungen (SMART, MVP)

* **NFR1 — Contract Compliance:** In einem definierten Testset bestehen mindestens 90% der Analysen die Schema-Validierung ohne Repair-Loop.
* **NFR2 — Robustheit Fehlerpfad/Repair:** Bei Schema-Fehlern wird der Lauf im aktuellen Standardpfad als `failed` markiert und gespeichert. Falls der vorbereitete Repair-Pfad aktiviert wird, bleibt er auf max. 2 Versuche begrenzt und endet danach ebenfalls explizit als `failed`.
* **NFR3 — Performance:** p95 Antwortzeit Analyse (ohne Cold Start) < 5s bei Texten bis 1'000 Zeichen.
* **NFR4 — Nachvollziehbarkeit:** Jeder gespeicherte Lauf enthält Prompt-Version, Modell-ID, Timestamp, Validierungsstatus und Run-Status.
* **NFR5 — Wartbarkeit/Testbarkeit:** Mindestens 80% Unit-Test-Coverage auf Domain/Application Layer (ohne UI). Zusätzlich: mindestens 1 E2E-Test für UJ1 (kritischer Pfad).
* **NFR6 — Sprachdetektion:** Bei gemischten Inputs wird dominante Sprache ermittelt (`detected_language`, `language_confidence`). Bei Sicherheit < 0.80 wird Lauf als `failed` mit `error_code=LANGUAGE_CONFIDENCE_TOO_LOW` gespeichert.

## 10. Operational Definitions (damit messbar/implementierbar)

### 10.1 Testset für NFR-Metriken

* Ein statisches Set von Beispielinputs (z. B. `tests/fixtures/inputs/*.txt`), mindestens 20 Texte (kurz/mittel/lang, DE/FR/EN, gemischte Fälle).
* Die Messung für NFR1 erfolgt als automatisierter Test/Script, das Runs auf diesem Set ausführt und Resultate aggregiert (ohne UI).

### 10.2 LLM Parameter (MVP Defaults)

* Temperatur: low (stabilitätsorientiert)
* Repair-Guardrail: max. 2 Versuche, falls der separate Repair-Pfad aktiviert wird.
* Prompt ist versioniert (siehe `prompt_version`)

### 10.3 Rerun Semantik

* `rerun` erzeugt **immer** einen neuen Lauf mit eigener ID.
* Der ursprüngliche Lauf bleibt unverändert (auditierbar).
* Rerun ist unabhängig vom Status des ursprünglichen Laufs möglich; auch ein `failed` Lauf kann als neuer Versuch erneut ausgeführt werden.

## 11. API (v1) — minimaler Umfang

* `POST /api/v1/analyses` (text -> run result)
* `GET /api/v1/analyses` (liste)
* `GET /api/v1/analyses/{id}` (detail)
* `POST /api/v1/analyses/{id}/rerun` (neuer run, gleicher input)

## 12. Error Contract (API-Fehlerform)

Alle Fehlerantworten folgen:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable",
    "details": { "optional": true },
    "correlation_id": "uuid"
  }
}
```

## 13. Daten & Persistenz (MVP)

Zu speichern:

* `input_text` (raw)
* `analysis_json` (validiert oder null bei failed)
* `validation_report` (Checks, Errors)
* Metadaten: `detected_language` (ISO-639-1), `language_confidence` [0..1], `model_id`, `prompt_version`, `run_status`, `validation_status`, `created_at`
* Fehler bei `failed`: `error_code`, `error_reason`

## 14. Abnahmekriterien (Acceptance)

* **AC1:** 6 Ebenen vorhanden und korrekt benannt (`symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`) (bei valid).
* **AC2:** JSON ist schema-valide oder als `failed` markiert + Report gespeichert.
* **AC3:** UI zeigt Pipeline mit allen Ebenen oder klaren Fehlzustand.
* **AC4:** Analysen sind in DB persistiert und abrufbar.
* **AC5:** Unit- und Integrations-Tests laufen reproduzierbar; 1 E2E-Test für UJ1 vorhanden.
* **AC6:** Output-Sprache entspricht Input-Sprache oder Lauf ist sauber als `failed` markiert (Fehlergrund).
* **AC7:** API-v1-Endpunkte sind vorhanden und dokumentiert.
* **AC8:** Sprachdetektionsfehler wird reproduzierbar behandelt und persistiert.

## 15. Risiken & Mitigations

* **R1:** LLM Format drift → strict schema, expliziter Fehlerlauf und bounded Repair als vorbereitete Guardrail.
* **R2:** Halluzination bei Ursachen → neutraler Prompt, „Hypothesen“-Wording, keine Faktbehauptungs-Sprache.
* **R3:** Scope creep → NGs strikt, Backlog separat.
* **R4:** UI Aufwand → pipeline-first, Fancy später.
