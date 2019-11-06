service                 := opinion
tag                     := 1.0.0
registry                ?= $(DOCKER_REGISTRY)
postgres_version        := 11

.PHONY: build
build:
	docker build --target runner -t $(service):$(tag) .

.PHONY: test
test:
	docker build --target tester -t $(service)-test:$(tag) .

.PHONY: deploy
deploy:
	helm upgrade --install --set image.tag=$(tag) $(service) ./k8s/$(service)

.PHONY: destroy
destroy:
	helm uninstall $(service)

.PHONY: localdb
localdb:
	docker run --name postgres \
                -e POSTGRES_PASSWORD=pass123 \
                -d -p 5432:5432 postgres:$(postgres_version)
