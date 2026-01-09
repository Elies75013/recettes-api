# API Recettes

API REST pour gérer des recettes de cuisine. Projet réalisé avec Node.js, Express et MongoDB.

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` :

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/recettes-api
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=24h
```

## Lancer le serveur

```bash
npm run dev
```

## Documentation

La doc Swagger est dispo sur http://localhost:3000/api-docs

## Routes principales

**Recettes**
- `GET /recettes` - lister les recettes
- `POST /recettes` - créer une recette (auth)
- `GET /recettes/:id` - voir une recette
- `PUT /recettes/:id` - modifier (auth)
- `DELETE /recettes/:id` - supprimer (auth)
- `POST /recettes/:id/aimer` - liker une recette
- `POST /recettes/:id/commentaires` - commenter

**Utilisateurs**
- `POST /utilisateurs/inscription` - créer un compte
- `POST /utilisateurs/connexion` - se connecter
- `GET /utilisateurs/profil` - voir son profil (auth)

## Filtres disponibles

On peut filtrer les recettes avec des query params :
- `?ingredient=tomate` - recherche par ingrédient
- `?auteur=martin` - recherche par auteur
- `?tri=-popularite` - tri par popularité
- `?page=2&limite=10` - pagination

## Auth

L'API utilise JWT. Après connexion, ajouter le token dans le header :
```
Authorization: Bearer <token>
```

## Stack

- Express 5
- MongoDB / Mongoose
- JWT pour l'auth
- Swagger pour la doc
