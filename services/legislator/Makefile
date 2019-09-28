service		:= legislator
tag		:= 1.0.0
registry	?= $(DOCKER_REGISTRY)

.PHONY: build
build:
	docker build -t $(service):$(tag) .

.PHONY: deploy
deploy:
	helm upgrade --install --set image.tag=$(tag) $(service) ./k8s/$(service)

.PHONY: localdb
localdb:
	docker run --name postgres \
		-e POSTGRES_PASSWORD=pass123 \
		-e POSTGRES_USER=brad \
		-e POSTGRES_DB=legislator \
		-d -p 5432:5432 postgres

