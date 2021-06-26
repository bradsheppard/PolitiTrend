# PolitiTrend Services

Before attempting to run or deploy the application 
it is necessay to have all services built and pushed to a Docker registry.

Each service resides in its own directory and contains a `Dockerfile` necessary for building Docker images.
Each service also contains its own Makefile which can simplify the process of building/pushing Docker
images for all services.

Before beginning, ensure your `DOCKER_REGISTRY` environment variable is pointing to the Docker registry
in which you wish to push Docker images.

To build the Docker image for a particular service, simply run

```
make build
```

from that services directory.

To push the Docker image to the registry, simply run

```
make push
```

