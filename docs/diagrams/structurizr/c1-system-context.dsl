workspace "SCM C1 System Context" "System context for the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Gibt Problemtexte ein, startet Analysen und prüft Ergebnisse."

        scm = softwareSystem "SCM" "Social Cleanup Machine: strukturiert Problemtexte in sechs Analyseebenen und persistiert nachvollziehbare Runs."

        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter für die optionale Analyseerzeugung im OpenAI-Pfad." {
            tags "External"
        }

        user -> scm "Nutzt über Webbrowser" "HTTP"
        scm -> llmProvider "Sendet Problemtext, erkannte Sprache, Prompt und JSON-Schema, wenn Provider=openai" "HTTPS"
    }

    views {
        systemContext scm "C1-System-Context" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
                background "#1f2937"
                color "#ffffff"
            }
            element "Software System" {
                background "#0f766e"
                color "#ffffff"
            }
            element "External" {
                background "#92400e"
                color "#ffffff"
            }
        }
    }
}
