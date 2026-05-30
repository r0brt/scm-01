workspace "SCM C2 Container" "C2 view of the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Nutzt SCM im Browser."

        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter." {
            tags "External"
        }

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            web = container "Web UI" "Browser-Oberfläche." "React, Vite, Nginx"
            api = container "Backend/API" "Analyse- und Run-API." "Python, FastAPI"
            db = container "Persistenz" "Run-Speicher." "PostgreSQL 17" {
                tags "Database"
            }
        }

        user -> web "Nutzt" "HTTP"
        web -> api "Ruft API auf" "HTTP/JSON"
        api -> db "Speichert Runs" "SQL"
        api -> llmProvider "Generiert Analyse optional" "HTTPS"
    }

    views {
        container scm "C2-SCM-Container" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
                background "#1e3a8a"
                color "#ffffff"
            }
            element "Container" {
                background "#2563eb"
                color "#ffffff"
            }
            element "Database" {
                shape cylinder
                background "#1d4ed8"
                color "#ffffff"
            }
            element "External" {
                background "#64748b"
                color "#ffffff"
            }
        }
    }
}
