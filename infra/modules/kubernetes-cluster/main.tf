
resource "google_container_cluster" "primary" {
  name     = "${var.name}-gke-cluster"
  location = var.zone

  provider = google-beta

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  cluster_autoscaling {
    enabled = false
    autoscaling_profile = "OPTIMIZE_UTILIZATION"
  }

  ip_allocation_policy {
    # Whether alias IPs will be used for pod IPs in the cluster. Defaults to
    # true if the ip_allocation_policy block is defined, and to the API
    # default otherwise. Prior to June 17th 2019, the default on the API is
    # false; afterwards, it's true.
  }

  private_cluster_config {
    # Whether the master's internal IP address is used as the cluster endpoint.
    enable_private_endpoint = false

    # Whether nodes have internal IP addresses only. If enabled, all nodes are
    # given only RFC 1918 private addresses and communicate with the master via
    # private networking.
    enable_private_nodes = true
    master_ipv4_cidr_block = "10.0.1.0/28"
  }

  network = var.vpc_id
  subnetwork = var.subnet_id

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

resource "google_service_account" "node_service_account" {
  account_id = "${var.name}-node-service-account"
  display_name = "${var.name}-node-service-account"
}

resource "google_compute_firewall" "webhook_admission_firewall" {
  name = "webhook-admission"
  network = var.vpc_id

  allow {
    protocol = "tcp"
    ports    = ["8443"]
  }

  source_ranges = ["10.0.1.0/28"]

  target_service_accounts = [google_service_account.node_service_account.email]
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "${var.name}-node-pool"
  cluster    = google_container_cluster.primary.name

  autoscaling {
    max_node_count = 5
    min_node_count = 1
  }

  location = var.zone

  node_config {
    preemptible  = true
    machine_type = "n1-standard-2"
    metadata = {
      disable-legacy-endpoints = "true"
    }

    service_account = google_service_account.node_service_account.email

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

resource "google_container_node_pool" "gpu_preemptible_nodes" {
  name = "${var.name}-gpu-pool"
  cluster = google_container_cluster.primary.name

  autoscaling {
    max_node_count = 1
    min_node_count = 0
  }

  location = var.zone

  node_config {
    preemptible = true
    machine_type = "n1-standard-2"
    metadata = {
      disable-legacy-endpoints = "true"
    }

    service_account = google_service_account.node_service_account.email

    guest_accelerator {
      count = 1
      type  = "nvidia-tesla-p100"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}
