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

.PHONY: kubefwd
kubefwd:
	curl -Lo kubefwd.deb https://github.com/txn2/kubefwd/releases/download/v1.9.2/kubefwd_amd64.deb
	apt-get install ./kubefwd.deb
	rm kubefwd.deb

.PHONY: minikube_start
minikube_start:
	minikube start --memory=16384 --cpus=4 --vm-driver=kvm2
	minikube ssh -- sudo ip link set docker0 promisc on

.PHONY: helm
helm:
	curl -LO https://get.helm.sh/helm-v3.0.0-beta.3-linux-amd64.tar.gz 
	tar -zxvf helm-v3.0.0-beta.3-linux-amd64.tar.gz
	mv linux-amd64/helm /usr/local/bin/helm

.PHONY: istioctl
istioctl:
	curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.3.0 sh -
	mv istio-1.3.0/bin/istioctl /usr/local/bin/istioctl	

.PHONY: istio
istio:
	istioctl experimental manifest apply

.PHONY: k8s
k8s: istio
