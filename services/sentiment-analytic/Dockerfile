FROM spark-gpu/spark-py:1.0.0 as runner

WORKDIR /app

USER root

RUN apt-get update && apt-get install -y python3.7 python3-pip curl build-essential python3.7-dev

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.7 1

RUN update-alternatives --set python3 /usr/bin/python3.7

RUN curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python3 get-pip.py --force-reinstall && \
    rm get-pip.py

RUN pip3 install setuptools

COPY requirements.txt .

RUN pip3 install -r requirements.txt

RUN python3 -m spacy download en

USER ${spark_uid}

COPY app.py config.ini run.sh ./

COPY sentiment_analytic sentiment_analytic

COPY lib lib
