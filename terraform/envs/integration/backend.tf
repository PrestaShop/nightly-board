terraform {
  backend "gcs" {
    prefix = "app-qanightlyresults"
    bucket = "terraform-testing-migration"
  }
}
