# 06 Laufzeitsicht

## Szenario 1: Verfuegbarkeitspruefung des Backends

1. Ein Client ruft `GET /health` am Backend auf.
2. Die FastAPI-Anwendung nimmt die Anfrage ohne weitere Abhängigkeiten entgegen.
3. Das Backend antwortet mit HTTP `200`.
4. Der Response-Body ist `{"status":"ok"}`.

## Szenario 2: Analyse eines Problemtexts via API v1

1. Ein Client sendet `POST /api/v1/analyses` mit einem Problemtext.
2. Das Backend erkennt zuerst lokal die dominante Sprache und bewertet die Sicherheit der Erkennung.
3. Bei zu geringer Sicherheit oder nicht unterstuetzter Sprache endet der Lauf sofort als `failed`; ein Run mit Fehlercode und Sprachmetadaten wird trotzdem persistiert.
4. Bei erfolgreicher Spracherkennung erzeugt der konfigurierte Analyse-Adapter die Analyse. Im Produktivpfad ist dies der OpenAI-Adapter, alternativ bleibt ein Stub-Pfad fuer Offline-Tests verfuegbar.
5. Das Backend validiert die Analyse gegen Schema und Pydantic-Modelle und fuehrt bei Bedarf einen begrenzten Repair-Loop aus.
6. Der Run wird mit Analyse-JSON, Validation-Report, Sprachmetadaten und Traceability-Feldern persistiert.
7. Die API antwortet synchron mit dem gespeicherten Run.

## Szenario 3: Retrieval und Rerun

1. Ein Client ruft `GET /api/v1/analyses` oder `GET /api/v1/analyses/{id}` auf.
2. Das Backend liest die gespeicherten Runs aus der Persistenz und liefert sie als API-Responses aus.
3. Bei `POST /api/v1/analyses/{id}/rerun` wird der urspruengliche `input_text` erneut verarbeitet.
4. Auch beim Rerun werden Spracherkennung, Analyse, Validierung und moeglicher Repair erneut durchlaufen.
5. Das System persistiert dafuer einen neuen Run; der alte Run bleibt unveraendert.
