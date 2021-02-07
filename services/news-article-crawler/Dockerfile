FROM nvidia/cuda:10.1-cudnn7-runtime-ubuntu18.04

ENV PATH=/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/conda/bin:$PATH

WORKDIR /app

RUN apt-get update && apt-get install -y python3.7 python3-pip curl

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.7 1

RUN update-alternatives --set python /usr/bin/python3.7

RUN curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python get-pip.py --force-reinstall && \
    rm get-pip.py

COPY requirements.txt crawler.py config.ini ./

RUN pip3 install -r requirements.txt

RUN python -m spacy download en

COPY crawler crawler

COPY test test

CMD ["python", "-u", "./crawler.py"]
