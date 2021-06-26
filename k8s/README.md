# PolitiTrend Helm Charts
This directory contains the Helm Charts necessary to deploy the application into a Kubernetes cluster.

Each chart is outlined as follows:

- minio: Contains the chart necessary for deploying the Minio datalake. This should be deployed before deploying
any services.
- nvidia: This chart contains the Daemonset which installs the Nvidia drivers into the GPU node pool. 
This is necessary for running the Neural nets which do the news article summarization (the `news-article-crawler` service).
- Operators: This chart installs both the Spark Operator and the Strimzi Kafka Operator. Be sure
to run this before installing the services chart, as many services contain CRDs which depend on this chart.
- Secrets: This chart contains secrets which are used in the Services chart. These secrets can
either be config files which are used by some of the services, or database credentials.
- Services: This chart is an umbrella chart which has several subcharts (one for each service).
