service := queue
tag	:= 1.0.0

.PHONY: deploy
deploy:
	helm upgrade --install queue bitnami/kafka -f values-dev.yaml
	# helm install queue bitnami/kafka -f values-production.yaml

.PHONY: topics
topics:
	kubectl exec queue-kafka-0 -- bash -c \
		"kafka-topics.sh --create --bootstrap-server 127.0.0.1:9092 --topic opinion --partitions 1 --replication-factor 1"
	

.PHONY: destroy
destroy:
	helm uninstall $(service)
