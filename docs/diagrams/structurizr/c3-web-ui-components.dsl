workspace "SCM C3 Web UI Components" "C3 web UI view of the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Nutzt SCM im Browser."

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            backend = container "Backend/API" "Analyse- und Run-API." "Python, FastAPI"
            web = container "Web UI" "React/Vite SPA" "React, TypeScript, Vite" {
                appShell = component "App Shell / Workspace" "Top-Level-Tabs, Run-Auswahl und Seitenorchestrierung." "frontend/src/App.tsx"
                analysisView = component "Analysis Flow View" "Eingabe, Pipeline-Flow, Review- und Fehlerdarstellung." "frontend/src/components"
                archiveView = component "Archive / Export View" "Archiv, Metadaten, JSON-Export und bewusstes Öffnen in Analyse." "frontend/src/components/RunHistoryPanel.tsx"
                apiClient = component "API Client" "HTTP-Zugriff auf Analyse-, Listen-, Detail- und Rerun-Endpunkte." "frontend/src/api.ts"
                viewModel = component "Pipeline State / View Model" "Deterministische Ableitung von Flow-, Review- und Fehlerzuständen." "frontend/src/pipeline.ts"
                types = component "Shared Types / Contract Mapping" "Frontend-Typen für API-Run, Analyse-JSON und Pipeline-Modell." "frontend/src/types.ts"
            }
        }

        user -> appShell "Nutzt"
        appShell -> analysisView "Rendert Analyse-Workspace"
        appShell -> archiveView "Rendert Archiv-Workspace"
        appShell -> apiClient "Erstellt/lädt Runs"
        analysisView -> viewModel "Nutzt Flow-Zustand"
        archiveView -> apiClient "Lädt Runs/Details"
        apiClient -> backend "Ruft API auf" "HTTP/JSON"
        types -> appShell "Typisiert"
        types -> analysisView "Typisiert"
        types -> archiveView "Typisiert"
        types -> apiClient "Typisiert"
        types -> viewModel "Typisiert"
    }

    views {
        component web "C3-Web-UI-Components" {
            properties {
                "plantuml.includes" "docs/diagrams/plantuml/c4-boundary-style.puml"
            }
            include *
            autoLayout tb
        }

        styles {
            element "Person" {
                shape person
                background "#1e3a8a"
                color "#ffffff"
            }
            element "Component" {
                background "#2563eb"
                color "#ffffff"
            }
            element "Container" {
                background "#60a5fa"
                color "#000000"
            }
        }
    }
}
