FROM gcr.io/spark-operator/spark-py:v2.4.5 as runner

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY app.py .

COPY config.ini .

COPY sentiment_analyzer sentiment_analyzer

COPY run.sh .

CMD ["./run.sh"]
