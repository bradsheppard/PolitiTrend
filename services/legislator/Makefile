.PHONY: localdb
localdb:
	docker run --name postgres \
		-e POSTGRES_PASSWORD=pass123 \
		-e POSTGRES_USER=brad \
		-d -p 5432:5432 postgres

