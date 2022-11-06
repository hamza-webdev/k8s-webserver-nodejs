# Kubernetes - K8s

create yaml file helloworld-pod.yml
````
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    name: mynginx
spec:
  containers:
  - name: mon-nginx
    image: nginx:latest
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
      - containerPort: 80
````

````
//Run this file:
kubectl apply -f helloworld-pod.yml
//watch all pods created
kubectl get pod
// OU
kubectl get all

# decribe pod vmd:
kubectl describe pod nginx

````
## Connect to pod nginx
* kubectl exec -it mon-nginx -- bash
* delete all pods:  kubectl delete all --all --all-namespaces
* * verifier la connection http sur nginx in container : curl http://localhost
* * Voir le log de pod: kubectl logs nginx
* Open dashboard minikube: minikube dashboard --url

