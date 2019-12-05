FROM python:3.8-alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY crawler crawler

COPY test test

COPY crawler.py .

COPY config.ini .

CMD ["python", "-u", "./crawler.py"]
