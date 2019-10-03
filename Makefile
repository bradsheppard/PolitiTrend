SUBDIRS := $(wildcard services/*)

.PHONY: deploy_all
deploy_all: $(SUBDIRS)

.PHONY: $(SUBDIRS)
$(SUBDIRS):
	$(MAKE) -C $@ deploy

destroy_all:
	helm ls --all --short | xargs -L1 helm delete
