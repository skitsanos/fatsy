project = "demo-docker"

app "fatsy-api" {
  url {
    auto_hostname = false
  }

  labels = {
    "service" = "demo-fatsy-api",
    "env"     = "dev"
  }

  build {
    use "docker" {}

    registry {
      use "aws-ecr" {
        region     = "eu-central-1"
        repository = "evi-waypoint-demos"
        tag        = "latest"
      }
    }
  }

  deploy {
    use "aws-ecs" {
      region = "eu-central-1"
      memory = "512"
    }
  }
}