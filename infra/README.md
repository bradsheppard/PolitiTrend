# PolitiTrend Infrastructure

This folder contains Terraform code necessary for deploying the Kubernetes cluster
in which the application will run. The infrastructure code makes use of Terragrunt to allow for more
DRY Terraform code.

This `modules` directory contain the modules which are used by each Terraform root.

The Terraform roots live in the `environments` directory. The `environments/dev` directory contains two 
subdirectories. `project` is the root module which spins up an associated GCP project. `infra` contains all of the
other Terraform roots necessary to spin up the infrastucture. Ensure that the GCP project is created prior
to deploying anything from the `infra` directory.

The `networking` root must deployed first. Once that completes the `kubernetes` root can be deployed.
After this completes, the associated Kubernetes Helm charts can be deployed from the `k8s` folder in the
root of the repo. Finally, the `minio` Terraform root can be deployed to create the necessary S3 buckets.
