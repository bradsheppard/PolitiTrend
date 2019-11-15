SUBDIRS := $(wildcard services/*)
TARGET	?= deploy

BUILD_TARGETS	:= services/politician services/frontend services/opinion
DEPLOY_TARGETS	:= services/politician services/frontend services/opinion services/queue

.PHONY: build_all
build_all: $(BUILD_TARGETS)

.PHONY: deploy_all
deploy_all:
	@for f in $(DEPLOY_TARGETS); do make -C $${f} deploy; done

.PHONY: build_all
build_all:
	@for f in $(BUILD_TARGETS); do make -C $${f} build; done

destroy_all:
	helm ls --all --short | xargs -L1 helm delete
