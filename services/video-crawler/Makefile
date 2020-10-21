service	:= video-crawler
tag	:= 1.0.0

.PHONY: lint
lint:
	pylint app.py crawler/ test/ --rcfile .pylintrc

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
