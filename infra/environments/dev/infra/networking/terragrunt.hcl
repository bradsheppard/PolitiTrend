include {
  path = find_in_parent_folders()
}

terraform {
  source = "../../../..//modules/network"
}

inputs = {
  location = "us-central1"
  name = "voyce"
}
