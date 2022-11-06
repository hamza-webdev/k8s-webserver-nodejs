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

## Expose pods deployment/apache to connect out with declaraticve cmd
````
kubectl expose deployment apache-deployment --name=apache-service --type=ClusterIP --port=8080 --target-port=8080

kubectl port-forward service/apache-service 8090:8080
ou
minikube service apache-service

````
# Dockorize notre application nodejs  dans dockerhub
  1. docker build . -t hamzabedwi/k8s-webserver-node
  2. docker image ls
  3. docker login
  4. docker push hamzabedwi/k8s-webserver-node
  5. create deployment pod k8s
     1. kubectl create deployment k8s-webserver-node --image=hamzabedwi/k8s-webserver-node:tagname
     2. kubectl get all
     3. kubectl expose deployment k8s-webserver-node --port=3000
     4. kubectl get svc
     5. kubectl scale deployment k8s-webserver-node --replicas=6
     6. Affiche (display) ip pods: kubectl get pods -o wide
     7. connect to pods: minikube ssh
     8. In Pod (docker@minikube): curl 172.17.0.5:300
     9. Delete service (k8s-webserver-node): kubectl delete svc k8s-webserver-node
     10. Modifier cmd to expose nodeport: kubectl expose deployment k8s-webserver-node --type=NodePort --port=3000
     11. display service: kubectl get services
     12. $> kubectl port-forward service/k8s-webserver-node 3001:3000  OU [$>minikube service k8s-webserver-node]

## Mettre a jor image docker to deploy k8s Update pod or app with strategy roll
1. kubectl set image deploy k8s-webserver-node k8s-webserver-node=hamzabedwi/k8s-webserver-node:1.2.0
2. kubectl rollout status deployment/k8s-webserver-node

## afficher les info sur 2 container in One Pod
````
kubectl get pods two-container-pod -o jsonpath='{.spec.containers[*].name}'
````
## define driver in minikube
1. minikube start --driver=docker

## display namespace in k8s
1. kubectl get namespace

## Ingress
1. minikube addons enable ingress
2. kubectl create deploy nginxservice --image=nginx:latest
3. kubectl scale deploy nginxservice --replicas=4
4. kubectl expose deploy nginxservice --port=80 --type=NodePort
5. kubectl get service
6. kubectl create ingress nginxservice-ingress --rule="/=nginxservice:80"
7. minikube ip    //=>resultet: 192.168.49.2

  ## configure file (/etc/hosts) hosts to minikube donner un domaine name for pod nginservice.io
  1. minikub ssh
  2. sudo bash -c 'echo "192.168.49.2 nginservice.io" >> /etc/hosts'
  3. display file hosts: $> cat /etc/hosts
  4. verifier la page nginx web via curk: $> curl nginservice.io

## describe ingress*
1. kubectl describe ingress nginxservice-ingress

## Delete pods and services with same names "baz" and "foo"
1. kubectl delete pod,service baz foo

## Deploy Fanout Ingress in Kubernetes (3 Apps Inside Cluster)
1.
