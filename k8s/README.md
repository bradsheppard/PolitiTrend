# PolitiTrend Helm Charts
This directory contains the Helm Charts necessary to deploy the application into a Kubernetes cluster.

Each chart is outlined as follows:

- minio: Contains the chart necessary for deploying the Minio datalake. This should be deployed before deploying
any services.
- nvidia: This chart contains the Daemonset which installs the Nvidia drivers into the GPU node pool. 
This is necessary for running the Neural nets which do the news article summarization (the `news-article-crawler` service).
- spark-operator: Operator which simplifies running Spark jobs in Kubernetes.
- kafka-operator: Operator which simplifies running Kafka clusters in Kubernetes.
- nginx-ingress-controller: Deploys an NGinx pod along with an external load balancer which allows you to expose
certain services externally (such as the frontend service).
- secrets: This chart contains secrets which are used in the Services chart. These secrets can
either be config files which are used by some of the services, or database credentials.
- services: This chart is an umbrella chart which has several subcharts (one for each service).
