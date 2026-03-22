"""Create runs table.

Revision ID: 20260322_01
Revises:
Create Date: 2026-03-22 00:00:00
"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "20260322_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the runs table."""
    op.create_table(
        "runs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("input_text", sa.Text(), nullable=False),
        sa.Column("analysis_json", sa.JSON(), nullable=True),
        sa.Column("validation_report", sa.JSON(), nullable=False),
        sa.Column("detected_language", sa.String(length=8), nullable=False),
        sa.Column("language_confidence", sa.Float(), nullable=False),
        sa.Column("model_id", sa.String(length=255), nullable=False),
        sa.Column("prompt_version", sa.String(length=64), nullable=False),
        sa.Column("run_status", sa.String(length=32), nullable=False),
        sa.Column("validation_status", sa.String(length=32), nullable=False),
        sa.Column("error_code", sa.String(length=64), nullable=True),
        sa.Column("error_reason", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    """Drop the runs table."""
    op.drop_table("runs")
