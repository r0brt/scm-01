workspace "SCM C3 Backend Components" "Backend component view for the Social Cleanup Machine MVP" {
    model {
        web = softwareSystem "Web UI" "React frontend."
        llmProvider = softwareSystem "LLM Provider" "Optional external provider." {
            tags "External"
        }
        database = softwareSystem "Persistenz" "PostgreSQL/SQLite storage." {
            tags "Database"
        }

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            backend = container "Backend/API" "FastAPI backend" "Python, FastAPI" {
                apiLayer = component "API Layer" "FastAPI endpoints, request validation, error mapping and correlation ID handling." "app/main.py, app/api"
                workflow = component "Analysis Workflow" "Orchestrates input language detection, analysis generation, validation, output-language check and persistence." "app/services/analysis_workflow.py"
                language = component "Language Detection" "Local deterministic language detection for de/fr/en with confidence threshold." "app/language"
                validation = component "Validation Service" "JSON Schema and Pydantic validation with structured validation reports." "app/services/validation.py"
                llm = component "LLM Adapter" "Provider-neutral generation port with Stub and OpenAI implementations." "app/llm"
                repo = component "Run Repository" "Creates, loads and lists persisted analysis runs." "app/repositories"
                dbModel = component "DB Model + Session" "SQLAlchemy model, engine and session factory." "app/db"
                repair = component "Repair Guardrail" "Prepared bounded repair validation, not active in the standard workflow." "app/services/repair.py"
            }
        }

        web -> apiLayer "Calls" "HTTP/JSON"
        apiLayer -> workflow "Starts analysis and rerun"
        workflow -> language "Detects input and output language"
        workflow -> llm "Generates analysis payload"
        workflow -> validation "Validates payload"
        workflow -> repo "Persists run"
        repair -> validation "Uses validation result and report" "prepared guardrail"
        repo -> dbModel "Uses"
        dbModel -> database "Reads/writes runs"
        llm -> llmProvider "Calls when Provider=openai" "HTTPS"
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
                background "#92400e"
                color "#ffffff"
            }
            element "Database" {
                shape cylinder
                background "#166534"
                color "#ffffff"
            }
        }
    }
}
