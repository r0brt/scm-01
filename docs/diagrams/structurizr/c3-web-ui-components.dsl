workspace "SCM C3 Web UI Components" "Web UI component view for the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Startet Analysen und prüft gespeicherte Runs."
        backend = softwareSystem "Backend/API" "FastAPI backend."

        scm = softwareSystem "SCM" "Social Cleanup Machine" {
            web = container "Web UI" "React/Vite SPA" "React, TypeScript, Vite" {
                appShell = component "App Shell" "Hält Top-Level-Tabs, Fehlerzustand, Run-Auswahl, Analysezustand und Orchestrierung." "frontend/src/App.tsx"
                composer = component "Analysis Composer" "Erfasst Problemtext und startet neue Analysen." "frontend/src/components/AnalysisComposer.tsx"
                pipeline = component "Pipeline View" "Rendert Flow- und Review-Modus der sechs Analyseebenen." "frontend/src/components/PipelineView.tsx"
                history = component "Run History Panel" "Archiv, Run-Auswahl, technische Metadaten, JSON-Export und bewusstes Öffnen in Analyse." "frontend/src/components/RunHistoryPanel.tsx"
                apiClient = component "API Client" "Kapselt HTTP-Aufrufe an Analyse-, Listen- und Detail-Endpunkte." "frontend/src/api.ts"
                viewModel = component "Pipeline View Model" "Leitet deterministische UI-Zustände aus Run, Loading-Status und Reveal Token ab." "frontend/src/pipeline.ts"
                types = component "Frontend Types" "Typsicht auf AnalysisRun, AnalysisJson und Pipeline-Viewmodelle." "frontend/src/types.ts"
            }
        }

        user -> appShell "Nutzt"
        appShell -> composer "Rendert und empfängt Submit"
        appShell -> pipeline "Rendert Analyseansicht"
        appShell -> history "Rendert Archivansicht"
        appShell -> apiClient "Lädt und erstellt Runs"
        appShell -> viewModel "Berechnet Pipeline-Zustand"
        pipeline -> viewModel "Nutzt abgeleitete Stage-Zustände"
        apiClient -> backend "Ruft API auf" "HTTP/JSON"
        types -> appShell "Definiert Run- und Viewmodel-Typen"
        types -> apiClient "Typisiert API-Antworten"
        types -> viewModel "Typisiert Pipeline-Zustände"
    }

    views {
        component web "C3-Web-UI-Components" {
            include *
            autoLayout tb
        }

        styles {
            element "Person" {
                shape person
                background "#1f2937"
                color "#ffffff"
            }
            element "Component" {
                background "#0f766e"
                color "#ffffff"
            }
        }
    }
}
