FROM python:3.7-slim-buster

WORKDIR /app

RUN apt-get update

RUN apt-get install -y gcc libpq-dev python-dev

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN python -m spacy download en

COPY alembic alembic

COPY test test

COPY crawler crawler

COPY crawler.py start.sh config.ini alembic.ini ./

CMD ["./start.sh"]
