terraform {
  extra_arguments "conditional_vars" {
    commands = [
      "apply",
      "plan"
    ]

    required_var_files = [
      "${get_terragrunt_dir()}/project.tfvars",
    ]
  }
}
