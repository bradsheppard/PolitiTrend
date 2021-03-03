remote_state {
  backend = "gcs"
  generate = {
    path = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket = "voyce-remote-state"
    prefix = "${path_relative_to_include()}"
    project = "voyce258cb34c"
    location = "us-east1"
  }
}

generate "provider" {
  path = "providers.tf"
  if_exists = "overwrite_terragrunt"

  contents = <<EOF
provider google {
  project = "voyce258cb34c"
}
provider google-beta {
  project = "voyce258cb34c"
}
EOF
}
