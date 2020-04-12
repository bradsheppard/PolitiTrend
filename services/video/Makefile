service                 := video
test                    := $(service)-test
tag                     := 1.0.0
registry                ?= $(DOCKER_REGISTRY)
target                  ?= dev

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
