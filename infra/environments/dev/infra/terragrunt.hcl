remote_state {
  backend = "gcs"
  generate = {
    path = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket = "polititrend-remote-state"
    prefix = "${path_relative_to_include()}"
    project = "polititrend621ec1ba"
    location = "us-central1"
  }
}

generate "provider" {
  path = "providers.tf"
  if_exists = "overwrite_terragrunt"

  contents = <<EOF
provider google {
  project = "polititrend621ec1ba"
}
provider google-beta {
  project = "polititrend621ec1ba"
}
EOF
}
