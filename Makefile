SUBDIRS := $(wildcard services/*)
TARGET	?= deploy

BUILD_TARGETS	:= services/politician
DEPLOY_TARGETS	:= services/politician services/queue

.PHONY: build_all
build_all: $(BUILD_TARGETS)

.PHONY: deploy_all
deploy_all: $(DEPLOY_TARGETS)

.PHONY: $(SUBDIRS)
$(BUILD_TARGETS):
	$(MAKE) -C $@ build

.PHONY: $(SUBDIRS)
$(DEPLOY_TARGETS):
	$(MAKE) -C $@ deploy

destroy_all:
	helm ls --all --short | xargs -L1 helm delete
