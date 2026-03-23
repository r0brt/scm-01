from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def test_compose_api_service_passes_openai_runtime_env_and_uses_repo_root_build_context() -> None:
    compose_text = (REPO_ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    dockerfile_text = (REPO_ROOT / "backend" / "Dockerfile").read_text(encoding="utf-8")

    assert "context: ." in compose_text
    assert "dockerfile: backend/Dockerfile" in compose_text
    assert "SCM_ANALYSIS_PROVIDER: ${SCM_ANALYSIS_PROVIDER:-stub}" in compose_text
    assert "SCM_OPENAI_MODEL: ${SCM_OPENAI_MODEL:-gpt-5.2}" in compose_text
    assert "OPENAI_API_KEY: ${OPENAI_API_KEY:-}" in compose_text
    assert "COPY prompts /prompts" in dockerfile_text
    assert "COPY schemas /schemas" in dockerfile_text


def test_env_example_keeps_openai_api_key_placeholder_empty() -> None:
    env_example_text = (REPO_ROOT / ".env.example").read_text(encoding="utf-8")

    assert "OPENAI_API_KEY=\n" in env_example_text
