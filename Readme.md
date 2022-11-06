# Kubernetes - K8s

* $> minikube start

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
* Add label to pod: kubectl label pod nginx owner=hamza-nginx
* kubectl get pod nginx --show-labels
*  filter : kubectl get pods -l owner=hamza-nginx
*  ex filter : kubectl get pods -l 'release in (production, dev), owner notin (hamza, jean)'

  ## Deployments in Kubernetes
  Un déploiement Kubernetes est utilisé pour indiquer à Kubernetes comment créer ou modifier des instances des pods qui contiennent une application conteneurisée
  Les déploiements peuvent mettre à l'échelle le nombre de pods de réplicas, activer le déploiement du code mis à jour de manière contrôlée ou revenir à une version de déploiement antérieure si nécessaire.
  ````
  kubectl create deployment nginx-dep --image=nginx
# scale server nginx to 7 server replicas
  kubectl scale deployment nginx-dep --replicas=7

# show info of pods
kubectl get pods -o wide

# Connect to node minikube:
 * minikube ssh

# Voir tous info sur api resources
  * kubectl api-resources

