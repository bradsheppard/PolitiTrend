FROM gcr.io/spark-operator/spark-py:v3.0.0 as runner

WORKDIR /app

COPY requirements.txt .

USER root

RUN pip3 install -r requirements.txt

RUN python3 -m spacy download en

USER ${spark_uid}

COPY app.py config.ini run.sh ./

COPY sentiment_analytic sentiment_analytic

COPY lib lib

CMD ["./run.sh"]
