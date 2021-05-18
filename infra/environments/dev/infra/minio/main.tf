terraform {
  required_providers {
    minio = {
      source = "aminueza/minio"
      version = ">= 1.0.0"
    }
  }
  required_version = ">= 0.13"
}

provider "minio" {
  minio_server = "minio:9000"
  minio_region = "us-east-1"
  minio_access_key = var.minio_access_key
  minio_secret_key = var.minio_secret_key
}

resource "minio_s3_bucket" "tweets" {
  bucket = "tweets"
}

resource "minio_s3_bucket" "sentiment_analytic_analyzed_tweets" {
  bucket = "sentiment-analytic-analyzed-tweets"
}
