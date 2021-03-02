resource "random_id" "id" {
  byte_length = 4
  prefix      = var.name
}

resource "google_project" "project" {
  name       = var.name
  project_id = random_id.id.hex
  auto_create_network = false
  billing_account = var.billing_account
}

resource "google_project_service" "gke-api" {
  project = google_project.project.project_id
  service = "container.googleapis.com"
}
