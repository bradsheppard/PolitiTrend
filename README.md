# PolitiTrend

Political trend/sentiment monitoring in realtime.

PolitiTrend analyzes political trends using social media content (primarily tweets) and is able to 
determine sentiment of politicians, political parties, etc.

## Architecture
The application runs within a microservice architecture in Kubernetes. Each service resides within the
`services` directory. Terraform code to deploy the Kubernetes cluster in GCP can be found in the `infra`
directory. Kubernetes Helm charts are found within the `k8s` folder.
