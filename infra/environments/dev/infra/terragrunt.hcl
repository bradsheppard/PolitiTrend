remote_state {
  backend = "gcs"
  generate = {
    path = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket = "polititrend-remote-state"
    prefix = "${path_relative_to_include()}"
    project = "polititrend258cb34c"
    location = "us-east1"
  }
}

generate "provider" {
  path = "providers.tf"
  if_exists = "overwrite_terragrunt"

  contents = <<EOF
provider google {
  project = "polititrend258cb34c"
}
provider google-beta {
  project = "polititrend258cb34c"
}
EOF
}
