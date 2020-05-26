FROM gcr.io/spark-operator/spark-py:v2.4.5 as runner

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

RUN python3 -m spacy download en

COPY app.py .

COPY config.ini .

COPY sentiment_analytic sentiment_analytic

COPY lib lib

COPY run.sh .

CMD ["./run.sh"]
