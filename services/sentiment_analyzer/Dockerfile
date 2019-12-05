FROM python:3.8-alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY sentiment_analyzer sentiment_analyzer

COPY test test

COPY crawler.py .

COPY config.ini .

CMD ["python", "-u", "./crawler.py"]
