FROM openjdk:8-buster as builder

WORKDIR /app

RUN apt-get update && apt-get install -y curl gnupg2

RUN echo "deb https://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list

RUN curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | apt-key add

RUN apt-get update && apt-get install -y sbt

COPY src src

COPY lib lib

COPY build.sbt .

COPY project/plugins.sbt project/plugins.sbt

RUN sbt assembly


FROM gcr.io/spark-operator/spark:v2.4.5 as runner

WORKDIR /app

COPY --from=builder /app/target/scala-2.11/word-cloud-analytic-assembly-1.0.jar word-cloud-analytic.jar
