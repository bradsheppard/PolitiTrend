service	:= news-article-crawler
tag	:= 1.0.0

.PHONY: build
build:
	docker build -t $(service):$(tag) .

.PHONY: push
push:
	docker tag $(service):$(tag) $(DOCKER_REGISTRY)/$(service):$(tag)
	docker push $(DOCKER_REGISTRY)/$(service):$(tag)

.PHONY: deploy
deploy:
	helm upgrade --install --set image.tag=$(tag) $(service) --values ./k8s/$(service)/values.yaml \
                --set image.repository=$(DOCKER_REGISTRY)/$(service) ./k8s/$(service)
