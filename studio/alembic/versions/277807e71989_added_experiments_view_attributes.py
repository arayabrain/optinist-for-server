"""added experiments.view_attributes

Revision ID: 277807e71989
Revises: c933537b9064
Create Date: 2024-01-16 17:47:09.916675

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "277807e71989"
down_revision = "c933537b9064"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("experiments", sa.Column("view_attributes", sa.JSON(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("experiments", "view_attributes")
    # ### end Alembic commands ###