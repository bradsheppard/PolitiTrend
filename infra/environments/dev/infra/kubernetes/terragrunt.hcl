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
  zone = "us-central1-b"
  vpc_id = dependency.networking.outputs.vpc_id
  subnet_id = dependency.networking.outputs.subnet_id
  accelerator_type = "nvidia-tesla-t4"
  machine_type = "n1-standard-2"
}
