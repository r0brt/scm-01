# 08 Querschnittliche Konzepte

## Analyse-Contract

Die Analyseausgabe folgt einem strikten JSON-Contract. Die fachliche Quelle dafuer ist `docs/scm.md`. Die sechs Ebenen sind fest vorgegeben: `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`. Zusaetzliche Felder sind nicht erlaubt. Vertiefte semantische Pruefungen erfolgen erst in den spaeteren Validierungs- und Repair-Milestones.

Jede Ebene folgt derselben Struktur mit `beschreibung` und `eintraege[].text`. Der Vertrag wird in Prompt, JSON Schema, Pydantic-Modellen, Persistenz-Payload und Frontend-Typen konsistent nachgezogen.

Der Vertragswechsel ist bewusst nicht rueckwaertskompatibel. Bestehende alte Analyse-Payloads werden nicht implizit uebersetzt oder aliasiert.

## Validierung und Repair

Die Backend-Validierung prüft Analyse-Payloads in zwei Stufen: zuerst gegen das JSON Schema, danach gegen die Pydantic-Modelle. Das Ergebnis ist ein strukturierter Validierungsreport mit Status, Fehlercode und Prüfschritten.

Bei ungültigen Payloads ist der Repair-Loop strikt begrenzt. Nach der initialen Prüfung sind höchstens zwei Reparaturversuche erlaubt. Schlägt auch der letzte Versuch fehl, endet der Lauf explizit mit `REPAIR_LIMIT_EXCEEDED`; es gibt keine stillen Fallbacks.

## Sprachdetektion

Vor jeder Analyse erkennt das Backend die dominante Sprache lokal. Aktuell werden `de`, `fr` und `en` unterstuetzt. Die Spracherkennung liefert immer `detected_language`, `language_confidence` und optional einen Fehlercode.

Liegt die Sicherheit unter `0.80`, endet der Lauf explizit mit `LANGUAGE_CONFIDENCE_TOO_LOW`. Wird eine Sprache ausserhalb des unterstuetzten Korridors erkannt, endet der Lauf mit `UNSUPPORTED_LANGUAGE`. In beiden Faellen wird kein stiller Fallback auf den LLM-Pfad versucht.

Nach erfolgreicher Eingabespracherkennung wird die erwartete Sprache explizit an den LLM-Adapter weitergegeben. Der Prompt verlangt, dass alle Felder `beschreibung` und `eintraege[].text` ausschliesslich in dieser Sprache formuliert werden und keine Sprachmischung enthalten.

Nach der strukturellen Validierung prueft das Backend zusaetzlich die Sprache der gesamten Analyseausgabe. Weicht die dominierende Ausgabesprache von der zuvor erkannten Eingabesprache ab oder ist die Ausgabespracherkennung selbst zu unsicher, endet der Lauf explizit mit `OUTPUT_LANGUAGE_MISMATCH`. Dadurch wird die Produktanforderung abgesichert, dass Ausgabe- und Eingabesprache uebereinstimmen.

## Persistenz

Analyse-Runs werden relational in einer einzelnen Tabelle `runs` gespeichert. Persistiert werden Eingabetext, Analyse-JSON, Validierungsreport sowie die für Nachvollziehbarkeit relevanten Metadaten wie `prompt_version`, `model_id`, `run_status`, `validation_status` und Fehlerangaben.

Schemaaenderungen werden nicht implizit aus ORM-Modellen erzeugt, sondern ueber Alembic-Migrationen versioniert. Dadurch bleiben Datenbankstruktur und Anwendungsmodell reproduzierbar und auditiert.

## Datenschutz und KI-Governance

Die Architektur behandelt Datenschutz und KI-Governance im MVP als querschnittliche Leitplanken, nicht als nachgelagerte Formalitaet. Fachlich relevante Datenkategorien sind vor allem `input_text`, `analysis_json`, `validation_report`, Sprachmetadaten und technische Traceability-Metadaten. Weil der freie Eingabetext personenbezogene, sensible oder situativ heikle Inhalte enthalten kann, wird er architektonisch nicht als harmlose Testnutzlast behandelt.

Die Aufbewahrung ist im aktuellen Stand technisch nachvollziehbar, aber operativ nur begrenzt ausdefiniert. Runs bleiben lokal gespeichert, bis die zugrunde liegende Datenbank bewusst bereinigt wird. Es gibt derzeit keine fachliche Loeschfunktion, keine dokumentierten Aufbewahrungsfristen pro Datenkategorie und keine vollstaendig ausgearbeitete Privacy-Operations-Sicht fuer Auskunft, Berichtigung oder Loeschung.

Transparenz entsteht im MVP ueber offen dokumentierte Datenpfade, die sichtbare Pipeline im Frontend und die persistierten technischen Metadaten pro Run. Die Anwendung ist als unterstuetzendes Analysewerkzeug konzipiert; sie trifft keine autonomen Sachentscheide und ersetzt keine menschliche Beurteilung. Menschliche Aufsicht bleibt insbesondere bei der Auswahl des Eingangstexts, bei der Interpretation der Analyse und bei jeder Weiterverwendung der Resultate erforderlich.

Die aktuellen Kontrollen bleiben bewusst begrenzt. Das System beschreibt keinen vollstaendigen rechtlichen Compliance-Nachweis, keine produktionsreife Anbietersteuerung und keine Ende-zu-Ende-Governance fuer alle moeglichen Einsatzkontexte. Die Architektur macht diese Grenzen explizit, statt regulatorische Vollstaendigkeit zu behaupten.

Als ergaenzende Governance-Sicht dient [docs/privacy-and-ai-governance.md](/Users/robert/code/scm-01/docs/privacy-and-ai-governance.md:1).

## API-Fehlervertrag

Die API mappt fachliche und technische Fehler zentral auf einen einheitlichen Fehlervertrag. Fehlerantworten enthalten immer `code`, `message`, `details` und eine generierte `correlation_id`.

In M4 werden mindestens ungueltige Requests und unbekannte Analyse-IDs explizit ueber diesen Vertrag beantwortet. Dadurch bleibt das Verhalten fuer Frontend und spaetere Integrationen stabil, auch wenn sich interne Implementierungen aendern.

## LLM-Adapter und Prompt-Versionierung

Die Analyseerzeugung erfolgt nicht direkt in der API oder im Workflow-Code, sondern ueber einen expliziten Adapter-Port. Dadurch bleiben Stub-, Test- und Provider-Implementierungen austauschbar.

Der aktuelle Produktivpfad verwendet den OpenAI-Responses-API-Adapter mit strikt angefordertem JSON-Schema-Output. Offline-Tests injizieren weiterhin Fake- oder Stub-Adapter und fuehren keine Netzaufrufe aus.

Prompts werden versioniert unter `prompts/v*/` abgelegt. Der aktuelle Produktivpfad verwendet `prompts/v2/analysis.md`. Der vom Adapter verwendete `prompt_version`-Wert und die `model_id` werden in jedem Run persistiert, damit die Herkunft einer Analyse nachvollziehbar bleibt. Die jeweils aktive Prompt-Version muss die in `docs/scm.md` definierten sechs Ebenen exakt anfordern.

Der aktuelle Analyse-Prompt kombiniert dabei drei Ebenen von Leitplanken: fachliche Definitionen fuer jede Analyse-Ebene, strikte Strukturvorgaben des JSON-Contracts und explizite Sprachvorgaben auf Basis der zuvor erkannten Eingabesprache.

## Traceability und Laufnachvollziehbarkeit

Die Nachvollziehbarkeit eines Analyse-Runs stuetzt sich nicht auf ein einzelnes Feld, sondern auf die Kombination mehrerer persistierter Metadaten. `prompt_version` zeigt, welche versionierte Prompt-Grundlage verwendet wurde. `model_id` dokumentiert den konkret eingesetzten Modellpfad. `validation_report` haelt den technischen Pruefpfad ueber Schema-, Modell- und gegebenenfalls Sprachpruefungen fest. `run_status`, `validation_status` und `error_code` machen sichtbar, ob ein Lauf erfolgreich war, an welcher Stelle er scheiterte und ob die Struktur gueltig war. `created_at` ordnet den Run zeitlich ein.

Diese Felder reichen fuer die Nachvollziehbarkeit einzelner Runs im MVP bereits weit, bilden aber noch keinen durchgaengigen Audit-Kontext ueber alle Schichten. Insbesondere ist die in API-Fehlerantworten erzeugte `correlation_id` derzeit nur punktuell fuer Fehlerkommunikation nutzbar und noch kein durchgehend persistiertes Traceability-Feld eines Runs. Damit bleibt die Fehlerdiagnose fuer Einzelaufrufe unterstuetzt, waehrend eine vollstaendige Ende-zu-Ende-Korrelation zwischen Frontend, API, Persistenz und optionalem Provider-Pfad noch nicht ausgebaut ist.

## Frontend-Praesentationskonzept

Das Frontend trennt bewusst zwischen Flow- und Review-Nutzung desselben Runs. Waerend der synchronen Analyseantwort entfaltet die UI die bereits vollstaendig vorliegende Analyse deterministisch als sequentielle Filterstrecke. Dabei ist immer nur die aktive Stage als Arbeitsflaeche sichtbar; andere Stages werden im Flow nur als Fortschrittsknoten oder reduzierte Zustandsmarker dargestellt.

Nach Abschluss wechselt dieselbe Analyse in einen Review-Modus. Dort werden alle sechs Stages gleichzeitig sichtbar, Details bleiben aber pro Stage standardmaessig reduziert und koennen gezielt aufgeklappt werden. Die `Essenz` bleibt als finaler Zielpunkt standardmaessig geoeffnet und optisch abgesetzt. Run-Historie, JSON-Export und technische Metadaten bleiben bewusst sekundaer, damit der primaere Fokus auf der Pipeline bleibt.

## Betriebs- und Konfigurationskonzept

Der lokale Standardbetrieb erfolgt ab M8 ueber Docker Compose. Konfiguration wird dabei ausschliesslich ueber Umgebungsvariablen injiziert; fuer den MVP sind insbesondere `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `SCM_DATABASE_URL`, `SCM_ANALYSIS_PROVIDER`, `SCM_OPENAI_MODEL` und `OPENAI_API_KEY` relevant.

Die API verwendet PostgreSQL im Compose-Betrieb als einziges Zielsystem und fuehrt Datenbankschema-Aenderungen nicht implizit ueber ORM-Erzeugung aus, sondern explizit ueber `alembic upgrade head` beim Containerstart. Dadurch bleibt der Container-Start reproduzierbar und das Schema im laufenden System entspricht der versionierten Migration-Historie.
