# Time Tracker

Application de suivi d'activité professionnelle — React 19 + TypeScript, Express, MongoDB.

[![CI](https://github.com/<ORG>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<ORG>/<REPO>/actions/workflows/ci.yml)

---

## Fonctionnalités

- **Saisie d'activités** : date, temps passé (0,25 / 0,5 / 0,75 / 1 j), projet, type, détail
- **Vue liste** avec regroupement par jour, barres de progression, édition / duplication / suppression inline
- **Récap par projet** : tableau hiérarchique Projet → Type → Activités avec pourcentages et barres de répartition
- **Plage de dates partagée** entre les onglets Activités et Récap (raccourcis Aujourd'hui / Cette semaine / Ce mois)
- **Alerte dépassement** : avertissement si le total du jour dépasse 1 journée (avec possibilité de forcer)
- **Export CSV** : copie dans le presse-papier, prêt à coller dans Excel (séparateur `;`)
- **Mode sombre / clair** avec persistance localStorage
- **Authentification** : connexion Microsoft (Azure AD / Entra ID) + connexion locale (fallback)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, TypeScript, Bootstrap 5.3 |
| Backend | Node.js, Express 4, JWT (local + MSAL) |
| Base de données | MongoDB 7 via Mongoose 8 |
| Auth | Azure MSAL (`@azure/msal-react`) + JWT local |
| Tests | Jest, React Testing Library (36 tests) |
| CI/CD | GitHub Actions |
| Conteneurs | Docker + docker-compose |

---

## Prérequis

- **Node.js** ≥ 20
- **MongoDB** en local (ou Docker)
- **Azure App Registration** pour l'authentification Microsoft (optionnel en dev)

---

## Démarrage rapide (développement)

```bash
# 1. Variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 2. Backend (port 5000)
npm install
node server.js

# 3. Frontend (port 3000, dans un second terminal)
cd client
npm install --legacy-peer-deps
npm start
```

---

## Avec Docker

```bash
# Lancer toute la stack (MongoDB + backend + frontend)
docker compose up --build

# Arrêter
docker compose down

# Arrêter et supprimer les données MongoDB
docker compose down -v
```

L'application est accessible sur **http://localhost:3000**.

---

## Variables d'environnement

Créer un fichier `.env` à la racine (voir `.env.example`) :

| Variable | Description | Exemple |
|---|---|---|
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/time-tracker` |
| `LOCAL_JWT_SECRET` | Secret pour signer les JWT locaux | chaîne aléatoire longue |
| `LOCAL_USERS` | Utilisateurs locaux `user:pass` | `admin:admin,alice:secret` |
| `AZURE_TENANT_ID` | Tenant ID Azure AD (optionnel en dev) | `xxxxxxxx-xxxx-...` |

---

## Authentification

### Microsoft (Azure AD / Entra ID)
Nécessite une **App Registration** dans votre tenant Azure :
1. Portail Azure → Entra ID → App registrations → New registration
2. Redirect URI : `http://localhost:3000` (type : Single-page application)
3. Copier le **Client ID** et le **Tenant ID**
4. Renseigner dans `client/src/authConfig.ts`

### Connexion locale (fallback)
Disponible sans App Registration via `LOCAL_USERS` dans `.env`.  
Le token expire après 8h.

---

## Tests

```bash
cd client
npx react-scripts test --watchAll=false
```

36 tests couvrant : activités (CRUD, CSV), formulaire (types, validation), dépassement journée (modal), récap par projet (agrégation, expansion), authentification (login page).

---

## Structure du projet

```
server.js                          # Backend Express (auth + API REST + MongoDB)
client/
  src/
    App.tsx                        # Racine React, gestion auth MSAL/locale
    TimeTracker.tsx                # Orchestrateur principal (tabs, dark mode)
    authConfig.ts                  # Configuration MSAL
    domain/
      Activity.ts                  # Interface + factory Activity
      Project.ts                   # Interface + factory Project
    services/
      api.ts                       # Instance axios
      activityApi.ts               # Appels API activités
      projectApi.ts                # Appels API projets & types
    hooks/
      useActivities.ts             # CRUD activités (async, API)
      useProjects.ts               # CRUD projets & types (async, API)
      useDarkMode.ts               # Toggle dark mode + localStorage
      useDateRange.ts              # Plage de dates + raccourcis
      useOverflowWarning.ts        # Logique alerte dépassement
      useAuthInterceptor.ts        # Intercepteur axios (Bearer token)
    components/
      activities/
        ActivityForm.tsx           # Formulaire de saisie
        ActivityList.tsx           # Liste avec édition inline
        DayProgress.tsx            # Barre de progression journée
      projects/
        ProjectForm.tsx            # Formulaire projet
        ProjectList.tsx            # Gestion projets & types globaux
      recap/
        ProjectRecap.tsx           # Tableau récap par projet
      ui/
        DateRangeFilter.tsx        # Sélecteur de plage de dates
        OverflowWarningModal.tsx   # Modale dépassement journée
      LoginPage.tsx                # Page de connexion (MS + locale)
    store/
      ActivityStore.ts             # Export CSV (utilitaire pur)
      ProjectStore.ts              # Données par défaut
.github/
  workflows/
    ci.yml                         # CI : tests + build sur push/PR
docker-compose.yml                 # Stack complète (mongo + backend + frontend)
Dockerfile.backend                 # Image backend Node.js
Dockerfile.frontend                # Image frontend nginx
nginx.conf                         # Proxy nginx (API + auth)
```

---

## Roadmap

- [ ] App Registration Azure AD → activer l'auth Microsoft
- [ ] Déploiement Azure (App Service + Cosmos DB)
- [ ] Export PDF du récap
- [ ] Notifications dépassement (email / Teams)
