workspace "SCM C2 Container" "Container view for the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Gibt Problemtexte ein und prüft Analyse-Runs."

        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter für den optionalen OpenAI-Pfad." {
            tags "External"
        }

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            web = container "Web UI" "React/Vite SPA, statisch über Nginx ausgeliefert. Zeigt Analyse, Archiv, Metadaten und JSON-Export." "React, Vite, Nginx"
            api = container "Backend/API" "FastAPI-Anwendung für Analyse, Run-Liste, Detailabruf, Rerun, Validierung, Sprachprüfung und Persistenzzugriff." "Python, FastAPI, SQLAlchemy"
            db = container "Persistenz" "Relationale Speicherung von Analyse-Runs, Validierungsreport und Traceability-Metadaten." "PostgreSQL 17" {
                tags "Database"
            }
        }

        user -> web "Nutzt" "HTTP"
        web -> api "Ruft API auf" "HTTP/JSON, /api/v1/analyses"
        api -> db "Speichert und lädt Runs" "SQLAlchemy/Alembic"
        api -> llmProvider "Fordert Analyse-Payload an, wenn Provider=openai" "HTTPS, Responses API"
    }

    views {
        container scm "C2-SCM-Container" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
                background "#1f2937"
                color "#ffffff"
            }
            element "Container" {
                background "#2563eb"
                color "#ffffff"
            }
            element "Database" {
                shape cylinder
                background "#166534"
                color "#ffffff"
            }
            element "External" {
                background "#92400e"
                color "#ffffff"
            }
        }
    }
}
