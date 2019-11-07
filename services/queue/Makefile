service := queue
tag	:= 1.0.0

.PHONY: deploy
deploy:
	helm upgrade --install queue bitnami/kafka
	# helm install queue bitnami/kafka -f values-production.yaml

.PHONY: destroy
destroy:
	helm uninstall $(service)
