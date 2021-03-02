#!/bin/sh

alembic upgrade head

python -u crawler.py