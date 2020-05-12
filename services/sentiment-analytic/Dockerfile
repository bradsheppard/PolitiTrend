FROM gcr.io/spark-operator/spark:v2.4.5 as runner

WORKDIR /app

COPY app.py .

COPY config.ini .

COPY sentiment_analyzer sentiment_analyzer

COPY run.sh .
