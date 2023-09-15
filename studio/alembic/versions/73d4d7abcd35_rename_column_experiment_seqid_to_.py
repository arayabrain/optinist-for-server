"""rename column experiment_seqid to experiment_uid

Revision ID: 73d4d7abcd35
Revises: 0d11c0a3c1b1
Create Date: 2023-07-26 13:05:30.848187

"""
import sqlalchemy as sa
from alembic import op

# from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "73d4d7abcd35"
down_revision = "0d11c0a3c1b1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        table_name="cells",
        column_name="experiment_seqid",
        new_column_name="experiment_uid",
        existing_type=sa.INTEGER,
        existing_nullable=False,
        existing_comment="foregn key for experiments.id",
    )
    op.alter_column(
        table_name="experiments_share_users",
        column_name="experiment_seqid",
        new_column_name="experiment_uid",
        existing_type=sa.INTEGER,
        existing_nullable=False,
        existing_comment="foregn key for experiments.id",
    )
    op.drop_index("ix_cells_experiment_seqid", table_name="cells")
    op.create_index(
        op.f("ix_cells_experiment_uid"), "cells", ["experiment_uid"], unique=False
    )
    op.drop_index("idx_experiment_seqid_user_id", table_name="experiments_share_users")
    op.drop_index(
        "ix_experiments_share_users_experiment_seqid",
        table_name="experiments_share_users",
    )
    op.create_unique_constraint(
        "idx_experiment_uid_user_id",
        "experiments_share_users",
        ["experiment_uid", "user_id"],
    )
    op.create_index(
        op.f("ix_experiments_share_users_experiment_uid"),
        "experiments_share_users",
        ["experiment_uid"],
        unique=False,
    )


def downgrade() -> None:
    op.alter_column(
        table_name="cells",
        column_name="experiment_uid",
        new_column_name="experiment_seqid",
        existing_type=sa.INTEGER,
        existing_nullable=False,
        existing_comment="foregn key for experiments.id",
    )
    op.alter_column(
        table_name="experiments_share_users",
        column_name="experiment_uid",
        new_column_name="experiment_seqid",
        existing_type=sa.INTEGER,
        existing_nullable=False,
        existing_comment="foregn key for experiments.id",
    )
    op.drop_index(
        op.f("ix_experiments_share_users_experiment_uid"),
        table_name="experiments_share_users",
    )
    op.drop_constraint(
        "idx_experiment_uid_user_id", "experiments_share_users", type_="unique"
    )
    op.create_index(
        "ix_experiments_share_users_experiment_seqid",
        "experiments_share_users",
        ["experiment_seqid"],
        unique=False,
    )
    op.create_index(
        "idx_experiment_seqid_user_id",
        "experiments_share_users",
        ["experiment_seqid", "user_id"],
        unique=False,
    )
    op.drop_index(op.f("ix_cells_experiment_uid"), table_name="cells")
    op.create_index(
        "ix_cells_experiment_seqid", "cells", ["experiment_seqid"], unique=False
    )
