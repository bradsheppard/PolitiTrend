FROM python:3.7-slim-buster

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN python3 -m spacy download en

COPY state_party_affiliation_analytic state_party_affiliation_analytic

COPY test test

COPY app.py .

COPY config.ini .

CMD ["python", "-u", "./crawler.py"]
