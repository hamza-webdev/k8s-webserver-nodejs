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
kubectl expose deployment apache-deployment --name=apache-service --type=ClusterIP --port=8080 --target-port=8080

kubectl port-forward service/apache-service 8090:8080
ou
minikube service apache-service


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

kubectl get pods two-container-pod -o jsonpath='{.spec.containers[*].name}'

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
1. kubectl create deploy app1 --image=httpd:latest
2. kubectl create deploy app2 --image=gcr.io/google-samples/hello-app:1.0
3. kubectl create deploy app3 --image=gcr.io/google-samples/hello-app:2.0
4. kubectl scale deploy app1 --replicas=3
5. kubectl scale deploy app2 --replicas=4
6. kubectl expose deploy app1 --port=80 --type=NodePort
7. kubectl expose deploy app2 --port=8080 --type=NodePort
8. display services with ip addresse: $> kubectl get svc
9.  NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    app1         NodePort    10.106.57.189   <none>        80:32608/TCP     77s
    app2         NodePort    10.100.56.171   <none>        8080:31471/TCP   56s
    app3         NodePort    10.110.160.73   <none>        8080:30997/TCP   45s
    kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          140m

### display app 1, 2 and 3 via minikube

  minikube service app1
  minikube service app2
  minikube service app3

  1. apply file fanout to create Connection ingress to 3 app
  2. kubectl apply -f fanout.yaml
  3. kubectl describe ingress multiapp-ingress
  OR
  minikube dashboard
  4. minikube ssh
  5. config hosts to new dns: hamzawebdev.io
  6. sudo /bin/sh -c 'echo "192.168.49.2  hamzawebdev.io" >> /etc/hosts'
  7. cat /etc/hosts
  8. Verifier curl for 3 app: $> curl hamzawebdev.io
  9. curl hamzawebdev.io/app1
  10. curl hamzawebdev.io/app2
  ````
## create to container deploy ahly and zamalek
```
kubectl create deploy ahly --image=nginx
kubectl create deploy zamalek --image=httpd
kubectl expose deploy ahly --port=80
kubectl expose deploy zamalek --port=80
minikube ssh
    sudo /bin/sh -c 'echo "192.168.49.2  ahly.io" >> /etc/hosts'
    sudo /bin/sh -c 'echo "192.168.49.2  zamalek.io" >> /etc/hosts'
kubectl create ingress sport-ingress --rule="ahly.io/=ahly:80" --rule="zamalek.io/=zamalek:80"
kubectl get ingress
to verify:
    minikube ssh
        curl ahly.io
        curl zamalek.io
```
## Resetting Minikube Cluster | Kubernetes
kubectl delete all --all -n default

## Configure Pod to Use Volume for Storage file: redis.yaml
```
apiVersion: v1
kind: Pod
metadata:
  name: "redis"
  labels:
    app: "redis"
spec:
  containers:
  - name: redis
    image: "redis"
    volumeMounts:
    - mountPath: /data/redis
      name: redis-storage
  volumes:
    - name: redis-storage
  restartPolicy: Always


```
1. kubectl apply -f redis.yaml
2. dans un nouveau terminal execute cmd pour surveiller le volume pod: $> kubectl get pod redis --watch
3. kubectl exec -it redis -- bash
   1. (dans le conteaur redis) $> apt-get update
   2. apt-get install procps
   3. ps aux

## creer 2 container UBuntu1 and ubuntu2 with same volume: vol
kubectl exec -it vols-demo -c ubuntu1 -- touch ubuntu1/test.text
kubectl exec -it vols-demo -c ubuntu2 -- ls ubuntu2

## Configuring Persistent Volumes in Kubernetes file: pv.yaml
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 2Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/tmp/data"
