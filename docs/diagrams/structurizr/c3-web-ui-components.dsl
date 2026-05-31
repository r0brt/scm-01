workspace "SCM C3 Web UI Components" "C3 web UI view of the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Nutzt SCM im Browser."

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            backend = container "Backend/API" "Analyse- und Run-API." "Python, FastAPI"
            web = container "Web UI" "React/Vite SPA" "React, TypeScript, Vite" {
                appShell = component "App Shell" "Orchestrierung." "frontend/src/App.tsx"
                composer = component "Analysis Composer" "Texteingabe." "frontend/src/components/AnalysisComposer.tsx"
                pipeline = component "Pipeline View" "Flow- und Review-Umschaltung." "frontend/src/components/PipelineView.tsx"
                resultView = component "Result View" "Review- und Fehleransicht für abgeschlossene Runs." "frontend/src/components/ResultView.tsx"
                stage = component "Stage" "Darstellung einer einzelnen Analyse-Ebene." "frontend/src/components/Stage.tsx"
                history = component "Run History Panel" "Archiv und Export." "frontend/src/components/RunHistoryPanel.tsx"
                apiClient = component "API Client" "HTTP-Zugriff." "frontend/src/api.ts"
                viewModel = component "Pipeline View Model" "UI-Zustand." "frontend/src/pipeline.ts"
                types = component "Frontend Types" "Typdefinitionen." "frontend/src/types.ts"
            }
        }

        user -> appShell "Nutzt"
        appShell -> composer "Rendert"
        appShell -> pipeline "Rendert"
        appShell -> history "Rendert"
        appShell -> apiClient "Erstellt/lädt Runs"
        appShell -> viewModel "Berechnet Zustand"
        pipeline -> viewModel "Nutzt"
        pipeline -> resultView "Rendert Review/Fehler"
        pipeline -> stage "Rendert Flow-Stages"
        resultView -> stage "Rendert Stage-Karten"
        apiClient -> backend "Ruft API auf" "HTTP/JSON"
        types -> appShell "Typisiert"
        types -> apiClient "Typisiert"
        types -> viewModel "Typisiert"
        types -> pipeline "Typisiert"
        types -> resultView "Typisiert"
        types -> stage "Typisiert"
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
