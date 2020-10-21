#!/bin/sh

alembic upgrade head

python -u app.py