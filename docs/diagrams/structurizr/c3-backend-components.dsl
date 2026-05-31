workspace "SCM C3 Backend Components" "C3 backend view of the Social Cleanup Machine MVP" {
    model {
        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter." {
            tags "External"
        }

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            web = container "Web UI" "React frontend." "React, Vite, Nginx"
            backend = container "Backend/API" "FastAPI backend." "Python, FastAPI" {
                apiLayer = component "API Layer" "HTTP-Endpunkte, Fehlervertrag, correlation_id und Dependency-Wiring." "app/main.py, app/api"
                workflow = component "Analysis Workflow" "Orchestriert Sprache, Analyse, Validierung und Persistenz." "app/services/analysis_workflow.py"
                language = component "Language Detection" "Sprachprüfung." "app/language"
                validation = component "Validation Service" "Contract-Prüfung." "app/services/validation.py"
                llm = component "LLM Adapter" "Stub/OpenAI hinter gemeinsamem Port." "app/llm"
                repo = component "Run Repository" "Run-Erzeugung, Listen- und Detailzugriff." "app/repositories"
                dbModel = component "DB Model + Session" "DB-Abstraktion." "app/db"
                repair = component "Repair Guardrail" "Vorbereitete bounded Repair-Logik; im Standardpfad nicht aktiv." "app/services/repair.py"
            }
            db = container "Persistenz" "Run-Speicher." "PostgreSQL 17" {
                tags "Database"
            }
        }

        web -> apiLayer "Ruft auf" "HTTP/JSON"
        apiLayer -> workflow "Startet Analyse/Rerun"
        apiLayer -> repo "Liest Runs"
        workflow -> language "Prüft Eingabe/Ausgabe"
        workflow -> llm "Fordert Payload an"
        workflow -> validation "Validiert Payload"
        workflow -> repo "Persistiert Runs"
        repair -> validation "Nutzt bei aktivierter Repair-Logik"
        repo -> dbModel "Nutzt"
        dbModel -> db "Liest/schreibt"
        llm -> llmProvider "Optionaler Providerpfad" "HTTPS"
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
            element "Container" {
                background "#60a5fa"
                color "#000000"
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
