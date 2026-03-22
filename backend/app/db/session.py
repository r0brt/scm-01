import os

from sqlalchemy import create_engine as sqlalchemy_create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker


def get_database_url() -> str:
    """Return the configured database URL or the local SQLite fallback."""
    return os.getenv("SCM_DATABASE_URL", "sqlite+pysqlite:///./scm.db")


def create_engine(database_url: str) -> Engine:
    """Create a SQLAlchemy engine for the given database URL."""
    return sqlalchemy_create_engine(database_url, future=True)


def create_session_factory(engine: Engine) -> sessionmaker[Session]:
    """Create the project's default SQLAlchemy session factory."""
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
