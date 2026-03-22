import os

from sqlalchemy import create_engine as sqlalchemy_create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker


def get_database_url() -> str:
    return os.getenv("SCM_DATABASE_URL", "sqlite+pysqlite:///./scm.db")


def create_engine(database_url: str) -> Engine:
    return sqlalchemy_create_engine(database_url, future=True)


def create_session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
