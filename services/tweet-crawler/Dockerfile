FROM python:3.7-slim-buster

WORKDIR /app

RUN apt-get update

RUN apt-get install -y gcc libpq-dev python-dev

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN python -m spacy download en

COPY crawler crawler

COPY test test

COPY crawler.py .

COPY config.ini .

CMD ["python", "-u", "./crawler.py"]
