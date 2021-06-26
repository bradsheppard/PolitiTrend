# PolitiTrend Infrastructure

This folder contains Terraform code necessary for deploying the Kubernetes cluster
in which the application will run.

Be sure to set the `billing_account` variable before running any Terraform code.

Run

```
terraform init
```

to download the GCP Provider for Terraform, then run

```
terraform apply
``` 

to spin up the GCP resources.
