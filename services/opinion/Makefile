service                 := opinion
test			:= $(service)-test
tag                     := 1.0.0
registry                ?= $(DOCKER_REGISTRY)
postgres_version        := 11
target			?= dev

.PHONY: build
build:
	docker build --target runner -t $(service):$(tag) .

.PHONY: push
push:
	docker tag $(service):$(tag) $(DOCKER_REGISTRY)/$(service):$(tag)
	docker push $(DOCKER_REGISTRY)/$(service):$(tag)

.PHONY: push_test
push_test:
	docker tag $(test):$(tag) $(DOCKER_REGISTRY)/$(test):$(tag)
	docker push $(DOCKER_REGISTRY)/$(test):$(tag)

.PHONY: test
test:
	docker build --target tester -t $(service)-test:$(tag) .

.PHONY: deploy
deploy:
	helm upgrade --install --set image.tag=$(tag) $(service) --values ./k8s/$(service)/$(target)_values.yaml \
		--set image.repository=$(DOCKER_REGISTRY)/$(service) ./k8s/$(service)

.PHONY: destroy
destroy:
	helm uninstall $(service)

.PHONY: localdb
localdb:
	docker run --name postgres \
                -e POSTGRES_PASSWORD=pass123 \
                -d -p 5432:5432 postgres:$(postgres_version)
