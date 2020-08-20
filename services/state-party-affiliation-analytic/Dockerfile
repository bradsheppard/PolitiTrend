FROM python:3.7-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y gcc python3.7-dev

COPY requirements.txt .

RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/app"

RUN python3 -m spacy download en

COPY state_party_affiliation_analytic state_party_affiliation_analytic

COPY test test

COPY app.py config.ini worker-spec.yml ./

CMD ["python", "-u", "./app.py"]
