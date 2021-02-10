"""Create Job table

Revision ID: 6a48f32a14d2
Revises: 
Create Date: 2021-02-08 21:01:35.539670

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6a48f32a14d2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Job',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('politician', sa.Integer(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Job')
    # ### end Alembic commands ###
