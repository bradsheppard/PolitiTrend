service                 := frontend
tag                     := 1.0.0
registry                ?= $(DOCKER_REGISTRY)
postgres_version        := 11

.PHONY: build
build:
	docker build --target runner -t $(service):$(tag) .

.PHONY: push
push:
	docker tag $(service):$(tag) $(DOCKER_REGISTRY)/$(service):$(tag)
	docker push $(DOCKER_REGISTRY)/$(service):$(tag)

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


