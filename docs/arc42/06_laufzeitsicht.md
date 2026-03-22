# 06 Laufzeitsicht

## Szenario 1: Verfügbarkeitsprüfung des Backend-Skeletons

1. Ein Client ruft `GET /health` am Backend auf.
2. Die FastAPI-Anwendung nimmt die Anfrage ohne weitere Abhängigkeiten entgegen.
3. Das Backend antwortet mit HTTP `200`.
4. Der Response-Body ist `{"status":"ok"}`.

## Hinweis

## Szenario 2: Analyse eines Problemtexts via API v1

1. Ein Client sendet `POST /api/v1/analyses` mit einem Problemtext.
2. Die API erzeugt in M4 eine kontrollierte Stub-Analyse aus dem Eingabetext.
3. Das Backend validiert die Analyse gegen Schema und Pydantic-Modelle.
4. Der Run wird mit Analyse-JSON, Validation-Report und Metadaten persistiert.
5. Die API antwortet synchron mit dem gespeicherten Run.

## Szenario 3: Retrieval und Rerun

1. Ein Client ruft `GET /api/v1/analyses` oder `GET /api/v1/analyses/{id}` auf.
2. Das Backend liest die gespeicherten Runs aus der Persistenz und liefert sie als API-Responses aus.
3. Bei `POST /api/v1/analyses/{id}/rerun` wird der urspruengliche `input_text` erneut verarbeitet.
4. Das System persistiert dafuer einen neuen Run; der alte Run bleibt unveraendert.
