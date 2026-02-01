# Time Tracker - Docker Setup

## 📦 Architecture

L'application est complètement dockerisée avec 3 services :

- **Frontend** (React 19 + Nginx) - Port 3000
- **Backend** (Express.js + Node) - Port 5000
- **Database** (MongoDB 7) - Port 27017

## 🚀 Quick Start

### Prérequis
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Lancer l'application

```bash
docker-compose up
```

Puis accédez à : **http://localhost:3000**

## 📋 Services

### Frontend (Nginx)
- **Port** : 3000
- **Build** : Multi-stage (build React + runtime Nginx)
- Proxy automatique des appels `/api/` vers le backend
- Supporte le routing React (SPA)

### Backend (Express)
- **Port** : 5000
- **Build** : Node 18 Alpine
- Variables d'environnement :
  - `MONGODB_URI` : URI MongoDB (défaut : `mongodb://mongodb:27017/time-tracker`)

### Database (MongoDB)
- **Port** : 27017
- **Volume** : `mongo-data` (persistance)
- Base de données : `time-tracker`

## 🔧 Commandes utiles

### Démarrer
```bash
docker-compose up
```

### Démarrer en arrière-plan
```bash
docker-compose up -d
```

### Arrêter
```bash
docker-compose down
```

### Arrêter et supprimer les volumes
```bash
docker-compose down -v
```

### Rebuild les images
```bash
docker-compose build --no-cache
```

### Logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Accès à la base de données
```bash
docker-compose exec mongodb mongosh time-tracker
```

## 🌍 Variables d'environnement

### Backend (.env ou docker-compose)
```
MONGODB_URI=mongodb://mongodb:27017/time-tracker
```

### Frontend
Les variables React doivent être préfixées par `REACT_APP_`

## 📦 Images personnalisées

### Build manuel

Frontend :
```bash
docker build -f Dockerfile.frontend -t time-tracker-frontend .
```

Backend :
```bash
docker build -f Dockerfile.backend -t time-tracker-backend .
```

## 🔗 API Endpoints

### Activity Codes
- `GET /api/activity-codes` - Récupérer tous les codes
- `POST /api/activity-codes` - Créer un code
- `DELETE /api/activity-codes/:id` - Supprimer un code

### Time Entries
- `GET /api/time-entries` - Récupérer toutes les entrées
- `POST /api/time-entries` - Créer une entrée
- `PATCH /api/time-entries/:id` - Mettre à jour une entrée
- `DELETE /api/time-entries/:id` - Supprimer une entrée

## 📊 Persistance

- **MongoDB** : Données persistées dans le volume `mongo-data`
- Survit aux redémarrages
- Nettoyage : `docker-compose down -v`

## 🛠️ Dépannage

### Frontend ne peut pas accéder au backend
Vérifier que le proxy Nginx est configuré (voir `nginx.conf`)

### MongoDB refuse les connexions
```bash
docker-compose logs mongodb
```

### Reconstruire tout
```bash
docker-compose down -v
docker-compose up --build
```

## 📄 Fichiers Docker

- `Dockerfile.backend` - Image Express
- `Dockerfile.frontend` - Image React + Nginx (multi-stage)
- `docker-compose.yml` - Orchestration
- `nginx.conf` - Configuration serveur web
- `.dockerignore` - Fichiers ignorés au build

## 🚢 Déploiement

Pour déployer en production :
1. Construire les images : `docker-compose build`
2. Push vers registry (DockerHub, ECR, etc.)
3. Déployer sur serveur (Docker Swarm, Kubernetes, etc.)

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
