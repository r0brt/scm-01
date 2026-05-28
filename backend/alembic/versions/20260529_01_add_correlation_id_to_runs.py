"""Add correlation_id to runs.

Revision ID: 20260529_01
Revises: 20260322_01
Create Date: 2026-05-29 00:00:00
"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "20260529_01"
down_revision = "20260322_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add a non-null correlation_id to persisted runs."""
    op.add_column("runs", sa.Column("correlation_id", sa.String(length=36), nullable=True))

    connection = op.get_bind()
    rows = connection.execute(sa.text("SELECT id FROM runs")).fetchall()
    for row in rows:
        connection.execute(
            sa.text("UPDATE runs SET correlation_id = :correlation_id WHERE id = :run_id"),
            {
                "correlation_id": f"legacy-run-{row.id}",
                "run_id": row.id,
            },
        )

    op.alter_column("runs", "correlation_id", nullable=False)


def downgrade() -> None:
    """Remove the correlation_id column from runs."""
    op.drop_column("runs", "correlation_id")
