FROM python:3.7-slim-buster

WORKDIR /app

COPY requirements.txt crawler.py config.ini ./

RUN pip install -r requirements.txt

COPY crawler crawler

COPY test test

CMD ["python", "-u", "./crawler.py"]
