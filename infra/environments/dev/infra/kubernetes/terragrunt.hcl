include {
  path = find_in_parent_folders()
}

dependency "networking" {
  config_path = "..//networking"
}

terraform {
  source = "../../../..//modules/kubernetes-cluster"
}

inputs = {
  name = "voyce"
  zone = "us-east1-b"
  vpc_id = dependency.networking.outputs.vpc_id
  subnet_id = dependency.networking.outputs.subnet_id
}
