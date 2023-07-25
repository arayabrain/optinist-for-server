"""add server onupdate

Revision ID: 0d11c0a3c1b1
Revises: ccc294b303eb
Create Date: 2023-07-24 20:28:38.664072

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0d11c0a3c1b1"
down_revision = "ccc294b303eb"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "ALTER table cells MODIFY column updated_at "
        "datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table experiments MODIFY column updated_at "
        "datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table users MODIFY column updated_at "
        "datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table workspaces MODIFY column updated_at "
        "datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
    )


def downgrade() -> None:
    op.execute(
        "ALTER table cells "
        "MODIFY column updated_at datetime NULL DEFAULT CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table experiments "
        "MODIFY column updated_at datetime NULL DEFAULT CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table users "
        "MODIFY column updated_at datetime NULL DEFAULT CURRENT_TIMESTAMP;"
    )
    op.execute(
        "ALTER table workspaces "
        "MODIFY column updated_at datetime NULL DEFAULT CURRENT_TIMESTAMP;"
    )
