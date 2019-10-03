service := queue
tag	:= 1.0.0

.PHONY: deploy
deploy:
	helm install queue bitnami/kafka -f values-production.yaml

.PHONY: destroy
destroy:
	helm uninstall $(service)
