service	:= spark-gpu
tag	:= 1.0.0

.PHONY: lint
lint:
	pylint app.py sentiment_analytic/ test/ --rcfile .pylintrc


.PHONY: build
build:
	docker build -t $(service):$(tag) .

.PHONY: push
push:
	docker tag $(service):$(tag) $(DOCKER_REGISTRY)/$(service):$(tag)
	docker push $(DOCKER_REGISTRY)/$(service):$(tag)

