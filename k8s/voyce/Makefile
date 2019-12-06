.PHONY: topics
topics:
	kubectl exec queue-kafka-0 -- bash -c \
		"kafka-topics.sh --create --bootstrap-server 127.0.0.1:9092 --topic opinion --partitions 1 --replication-factor 1"

.PHONY: strimzi
strimzi:
	helm install queue strimzi/strimzi-kafka-operator --set resources.requests.memory=128Mi,resources.requests.cpu=120m,resources.limits.cpu=240m,resources.limits.memory=256Mi
