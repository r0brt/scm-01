from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RunRecord(Base):
    __tablename__ = "runs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    analysis_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    validation_report: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    detected_language: Mapped[str] = mapped_column(String(8), nullable=False)
    language_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    model_id: Mapped[str] = mapped_column(String(255), nullable=False)
    prompt_version: Mapped[str] = mapped_column(String(64), nullable=False)
    run_status: Mapped[str] = mapped_column(String(32), nullable=False)
    validation_status: Mapped[str] = mapped_column(String(32), nullable=False)
    error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    error_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
