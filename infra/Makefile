.PHONY: kubectl
kubectl:
	curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
	chmod +x ./kubectl
	mv ./kubectl /usr/local/bin/kubectl

.PHONY: kvm
kvm:
	apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
	adduser `id -un` libvirt

.PHONY: minikube
minikube:
	curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
	install minikube /usr/local/bin
