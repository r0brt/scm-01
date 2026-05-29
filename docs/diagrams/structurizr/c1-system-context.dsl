workspace "SCM C1 System Context" "C1 view of the Social Cleanup Machine MVP" {
    model {
        user = person "User" "Nutzt SCM im Browser."

        scm = softwareSystem "SCM" "Social Cleanup Machine."

        llmProvider = softwareSystem "LLM Provider" "Externer KI-Anbieter." {
            tags "External"
        }

        user -> scm "Nutzt" "HTTP"
        scm -> llmProvider "Generiert Analyse optional" "HTTPS"
    }

    views {
        systemContext scm "C1-System-Context" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
                background "#1e3a8a"
                color "#ffffff"
            }
            element "Software System" {
                background "#2563eb"
                color "#ffffff"
            }
            element "External" {
                background "#64748b"
                color "#ffffff"
            }
        }
    }
}
