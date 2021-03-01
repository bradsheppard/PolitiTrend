include {
  path = find_in_parent_folders()
}

terraform {
  extra_arguments "vars" {
    commands = [
      "plan",
      "apply"
    ]

    required_var_files = [
      "${get_terragrunt_dir()}/dev.tfvars"
    ]
  }
}
