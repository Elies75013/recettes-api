/**
 * =================================================================
 * API Recettes - Point d'entrée de l'application
 * =================================================================
 * 
 * Ce fichier est le point d'entrée principal de l'API.
 * Il charge les variables d'environnement, établit la connexion
 * à la base de données MongoDB et démarre le serveur Express.
 * 
 * @author Elies
 * @version 1.0.0
 * @date Janvier 2026
 */

// Chargement des variables d'environnement depuis le fichier .env
require("dotenv").config();

// Import de l'application Express configurée
const app = require("./src/app");

// Import de la fonction de connexion à MongoDB
const connectDB = require("./src/config/db");

// Port d'écoute du serveur (par défaut: 3000)
const PORT = process.env.PORT || 3000;

/**
 * Initialisation de la connexion à la base de données
 * La connexion doit être établie avant de démarrer le serveur
 */
connectDB();

/**
 * Démarrage du serveur HTTP
 * Le serveur écoute sur le port spécifié et affiche un message de confirmation
 */
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
});

