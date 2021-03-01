resource "google_compute_network" "vpc" {
  name                    = "${var.name}-vpc"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "private_subnet" {
  name          = "${var.name}-private-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.vpc.name
  depends_on    = [google_compute_network.vpc]
  region        = var.location
  private_ip_google_access = "true"
}

resource "google_compute_router" "router" {
  name    = "${var.name}-router"
  region  = var.location
  network = google_compute_network.vpc.self_link

  bgp {
    asn = 64514
  }
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.name}-router-nat"
  router                             = google_compute_router.router.name
  region                             = google_compute_router.router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}
