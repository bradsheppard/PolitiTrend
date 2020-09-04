FROM python:3.7-slim-buster

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY crawler.py config.ini ./

COPY crawler crawler

COPY test test

CMD ["python", "-u", "./crawler.py"]
