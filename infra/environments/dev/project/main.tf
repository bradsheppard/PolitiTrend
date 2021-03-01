provider "google" {
  version = ">= 3.5"
}

module "project" {
  source = "../../../modules/project"
  billing_acccount = var.billing_account
  name = var.name
}
