service		:= legislator
tag		:= 1.0.0
registry	?= $(DOCKER_REGISTRY)

.PHONY: build
build:
	docker build --target runner -t $(service):$(tag) .

.PHONY: test
test:
	docker build --target tester -t $(service)-test:$(tag) .

.PHONY: deploy
deploy:
	helm upgrade --install $(service)-db -f ./k8s/postgres/values-production.yaml stable/postgresql
	helm upgrade --install --set image.tag=$(tag) $(service) ./k8s/$(service)

.PHONY: destroy
destroy:
	helm uninstall $(service)-db
	helm uninstall $(service)

.PHONY: localdb
localdb:
	docker run --name postgres \
		-e POSTGRES_PASSWORD=pass123 \
		-e POSTGRES_USER=brad \
		-e POSTGRES_DB=legislator \
		-d -p 5432:5432 postgres

