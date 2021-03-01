remote_state {
  backend = "gcs"
  generate = {
    path = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket = "remote-state-dev"
    prefix = "${path_relative_to_include()}"
    project = "voyce866d5d9a"
    location = "us-east1"
  }
}

generate "provider" {
  path = "provider.tf"
  if_exists = "overwrite_terragrunt"

  contents = <<EOF
provider "google" {
  project = "voyce866d5d9a"
}
provider "google-beta" {
  project = "voyce866d5d9a"
}
EOF
}
