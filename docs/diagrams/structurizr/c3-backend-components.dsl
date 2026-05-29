workspace "SCM C3 Backend Components" "C3 backend view of the Social Cleanup Machine MVP" {
    model {
        web = softwareSystem "Web UI" "React frontend."
        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter." {
            tags "External"
        }
        database = softwareSystem "Persistenz" "Run-Speicher." {
            tags "Database"
        }

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            backend = container "Backend/API" "FastAPI backend" "Python, FastAPI" {
                apiLayer = component "API Layer" "HTTP-Endpunkte." "app/main.py, app/api"
                workflow = component "Analysis Workflow" "Orchestrierung." "app/services/analysis_workflow.py"
                language = component "Language Detection" "Sprachprüfung." "app/language"
                validation = component "Validation Service" "Contract-Prüfung." "app/services/validation.py"
                llm = component "LLM Adapter" "Analyseerzeugung." "app/llm"
                repo = component "Run Repository" "Run-Zugriff." "app/repositories"
                dbModel = component "DB Model + Session" "DB-Abstraktion." "app/db"
                repair = component "Repair Guardrail" "Vorbereitete Guardrail." "app/services/repair.py"
            }
        }

        web -> apiLayer "Ruft auf" "HTTP/JSON"
        apiLayer -> workflow "Delegiert"
        workflow -> language "Prüft Sprache"
        workflow -> llm "Generiert Payload"
        workflow -> validation "Validiert"
        workflow -> repo "Persistiert"
        repair -> validation "Nutzt"
        repo -> dbModel "Nutzt"
        dbModel -> database "Liest/schreibt"
        llm -> llmProvider "Optional" "HTTPS"
    }

    views {
        component backend "C3-Backend-Components" {
            include *
            autoLayout tb
        }

        styles {
            element "Component" {
                background "#2563eb"
                color "#ffffff"
            }
            element "External" {
                background "#64748b"
                color "#ffffff"
            }
            element "Database" {
                shape cylinder
                background "#1d4ed8"
                color "#ffffff"
            }
        }
    }
}
