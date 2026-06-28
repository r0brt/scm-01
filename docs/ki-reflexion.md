# Anhang: Reflexion KI-Einsatz und Fazit

## KI als Teil des Entwicklungsprozesses

In diesem Projekt war KI nicht einfach ein Werkzeug, das ich ab und zu geöffnet habe, um schneller vorwärtszukommen. Codex mit Superpowers war über weite Strecken Teil meines Entwicklungsprozesses. ChatGPT habe ich zusätzlich für Brainstorming, Formulierungen und einzelne Reflexionsfragen genutzt. Das war rückblickend passend, weil die Social Cleanup Machine selbst ein KI-gestütztes System ist. Ich habe also mit KI gearbeitet und gleichzeitig ein Produkt gebaut, bei dem KI-Ausgaben kontrolliert, begrenzt und nachvollziehbar gemacht werden müssen.

Der wichtigste Nutzen lag für mich nicht darin, möglichst viel Code generieren zu lassen. Wertvoller war, dass Codex den Arbeitsprozess disziplinierter gemacht hat. Gerade bei einem Solo-Projekt ist es verlockend, direkt mit der Umsetzung zu beginnen und Architektur oder Tests später nachzuziehen. Mit Superpowers lief es anders: Anforderungen klären, Plan schreiben, Tests definieren, implementieren, prüfen und dokumentieren. Das war manchmal langsamer, als ich es spontan gemacht hätte, aber am Ende besser. Aus einer Idee wurde dadurch ein nachvollziehbares System mit PRD, PLAN, arc42-Dokumentation, ADRs, Testreport, Abnahmecheckliste, Backend, Frontend, Persistenz und Docker-Compose-Betrieb.

## Nutzen in Architektur und Backend

Besonders stark war die KI bei Architektur- und Backend-Themen. Die Social Cleanup Machine musste fachlich eng geführt werden: Ein eingegebener Problemtext wird in die sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` zerlegt. Das System soll aber keine Wahrheit feststellen, kein Fact-Checking machen und keine Massnahmen empfehlen.

Codex half mir, diese Idee technisch sauberer zu übersetzen: FastAPI-Backend, React/Vite-Frontend, striktes JSON-Schema, Pydantic-Modelle, Validierung, LLM-Adapter, Prompt-Versionierung, OpenAPI-Vertrag, persistierte Runs und technische Metadaten. Im Backend funktionierte die Zusammenarbeit deshalb gut, weil viele Qualitätsfragen überprüfbar waren. Entspricht die Antwort dem Schema? Wird ein ungültiges Payload als Fehler behandelt? Sind `prompt_version`, `model_id`, `run_status`, `validation_status`, `error_code` und `correlation_id` vorhanden? Läuft der Contract-Test? Solche Fragen kann man testen.

Dort war Codex sehr hilfreich, weil es nicht nur einzelne Codefragmente schreiben konnte, sondern auch Tests, Services und API-Schichten zusammenhängend bearbeitete. Trotzdem musste ich die Ergebnisse immer prüfen. Gerade weil KI-Vorschläge oft überzeugend klingen, besteht die Gefahr, sie zu schnell zu übernehmen.

## Konsistenz als wiederkehrende Aufgabe

In diesem Projekt wäre ein unkritischer Umgang mit KI besonders problematisch gewesen. SCM soll gerade nicht eine hübsche Oberfläche für unkontrollierte KI-Antworten sein. Die Analyse soll strukturiert, validiert und nachvollziehbar sein. Ein Problem war dabei, dass PRD, Architektur und Implementierung einzeln oft plausibel wirkten, aber nicht automatisch sauber zusammenpassten.

Besonders die fachliche Grenze von SCM musste überall sichtbar bleiben: im Prompt, im Schema, in Statusfeldern, Tests und Dokumentation. Diese Konsistenz entstand nicht von selbst. Ich musste sie an mehreren Stellen bewusst nachziehen und wieder prüfen.

## Frontend und Produktwirkung

Im Frontend war die Zusammenarbeit schwieriger. Codex konnte Komponenten, Zustände und Tests erstellen, aber die visuelle Wirkung war viel schwerer zu steuern. Zwischendurch hatte ich eine funktionierende Oberfläche, die technisch korrekt war, aber eher wie ein normales Formular mit Ergebnisboxen wirkte. Das passte nicht zur Idee der Social Cleanup Machine als Filterstrecke, bei der sichtbar wird, wie ein Problemtext Schritt für Schritt entflechtet wird.

An dieser Stelle wurde für mich sehr konkret klar: Funktionierender Code ergibt noch kein passendes Produkt. Begriffe wie ruhig, klar, weniger dominant oder professioneller sind für mich verständlich, für eine KI aber oft zu vage. Dort brauchte es mehr Iterationen und mehr eigene Entscheidungen.

## Dokumentation und Review-Arbeit

Auch bei der Dokumentation war KI hilfreich. arc42, ADRs, Testreport, Abnahmecheckliste und der PDF-Export waren keine Nebensachen, sondern Teil der Abgabequalität. Gerade der Export der arc42-Dokumentation hätte leicht viel Zeit gefressen: Kapitelstruktur, Formatierung, Layout und technische Fehler. Codex konnte solche Aufgaben systematisch angehen und wiederholbar machen. Das war ein gutes Beispiel dafür, dass KI nicht nur beim Produktcode hilft, sondern auch bei der Arbeit rund um das Produkt.

Ambivalent sehe ich KI-Reviews. Einerseits waren sie sehr nützlich. Codex fand unklare Stellen, Wiederholungen, fehlende Nachweise und Inkonsistenzen zwischen PRD, Architektur und Implementierung. Gerade bei Datenschutz, KI-Governance und Traceability war das wichtig. Andererseits schlug Codex teilweise zusätzliche Erklärungen, Absicherungen oder Unterkapitel vor, die einzeln sinnvoll klangen, die Dokumentation aber aufgebläht hätten. Ich musste dann entscheiden, was wirklich zur Abgabequalität beiträgt und was nur noch Feinschliff ist.

## Was ich nicht delegiert habe

Mit der Zeit wurde mir klar, dass es drei Bereiche gibt, die ich bewusst nicht an die KI abgeben wollte.

Erstens habe ich die fachliche Grenze der Social Cleanup Machine nicht an die KI delegiert. Die KI durfte mir helfen, Texte zu strukturieren oder Architekturvarianten zu formulieren. Sie durfte aber nicht bestimmen, was SCM eigentlich sein soll. Teilweise gingen Vorschläge von Codex in eine Richtung, in der die Anwendung allgemeiner oder hilfreicher geworden wäre, etwa durch Empfehlungen, Bewertungen oder stärkere Interpretation. Genau das wollte ich vermeiden. Im PRD ist festgehalten: SCM soll Problemtexte entflechten, aber keine Inhalte bewerten, kein Fact-Checking betreiben, keine politische Position beziehen und keine Massnahmen empfehlen. Ohne diese Grenze würde aus SCM schnell ein allgemeiner Ratgeber werden. Das wäre ein anderes Produkt.

Zweitens habe ich die Entscheidung über Fehlerverhalten und Zuverlässigkeit nicht an die KI delegiert. Ein LLM-Output darf nicht einfach akzeptiert werden, nur weil er gut klingt. Deshalb gibt es im Projekt das JSON-Schema unter `schemas/`, die Pydantic-Modelle, Contract-Tests, Validierungsreports und die expliziten Statusfelder pro Run. Wenn eine Analyse strukturell ungültig ist oder die Sprache nicht passt, soll das sichtbar werden. Im aktuellen Standardpfad wird so ein Fall als `failed` gespeichert oder als klarer API-Fehler zurückgegeben. Das ist im PRD, in arc42 und in den Tests belegt. Die KI konnte diese Mechanik implementieren helfen, aber die Grundhaltung war meine: lieber ein sichtbarer Fehler als ein scheinbar sauberes Ergebnis, dem man nicht trauen kann.

Drittens habe ich die Abgabereife nicht an die KI delegiert. Codex konnte Testläufe anstossen, Dokumentation prüfen, Formulierungen verbessern und auf Lücken hinweisen. Aber ob das Projekt wirklich abgabefähig ist, musste ich selbst beurteilen. Dazu gehörten der Testreport, die Abnahmecheckliste, die Konsistenz zwischen PRD und Implementierung, die arc42-Dokumentation, die ADRs, der OpenAPI-Snapshot und der Docker-Compose-Nachweis. Die KI konnte sagen, dass etwas plausibel wirkt. Sie konnte aber nicht entscheiden, welches Restrisiko akzeptabel ist oder wann genug verbessert wurde. Diese Verantwortung blieb bei mir.

## Fazit

Für meine künftige Arbeitsweise nehme ich daraus eine klare Haltung mit. Ich werde KI weiterhin intensiv nutzen, aber nicht blind. Sinnvoll ist sie für Struktur, Varianten, Tests, Reviews, Dokumentationsarbeit, Fehlersuche und wiederholbare technische Aufgaben. Nicht delegieren werde ich fachliche Zielentscheidungen, ethische Grenzen, Qualitätsfreigaben und die Verantwortung für das Endresultat. Genau dort muss ich selbst verstehen, entscheiden und im Zweifel auch Nein sagen.

KI hat dieses Projekt deutlich besser gemacht. Sie hat Tempo gebracht, aber wichtiger waren Struktur und Nachvollziehbarkeit. Gleichzeitig hat sie mir gezeigt, dass gute Software nicht entsteht, weil man schnell Code erzeugen lässt. Gute Software entsteht durch klare Anforderungen, überprüfbare Verträge, Tests, saubere Dokumentation und bewusste Entscheidungen. KI kann dabei sehr stark unterstützen. Entscheiden und verantworten musste ich das Projekt am Ende selbst.
