service	:= sentiment-analytic
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

.PHONY: make_buckets
make_buckets:
	mc mb s3/tweets s3/sentiment-analytic-analyzed-tweets
