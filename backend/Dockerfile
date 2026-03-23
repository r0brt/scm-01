FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

WORKDIR /app

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

COPY backend/pyproject.toml backend/uv.lock backend/alembic.ini ./
COPY backend/alembic ./alembic
COPY backend/app ./app
COPY prompts /prompts
COPY schemas /schemas

RUN uv sync --frozen --no-dev

EXPOSE 8000

CMD ["sh", "-c", "uv run --no-dev alembic upgrade head && uv run --no-dev uvicorn app.main:app --host 0.0.0.0 --port 8000"]
