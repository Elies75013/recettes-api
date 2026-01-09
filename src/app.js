/**
 * =================================================================
 * Configuration de l'application Express
 * =================================================================
 * 
 * Ce fichier configure l'application Express avec tous les
 * middlewares, routes et gestionnaires d'erreurs nécessaires.
 */

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Création de l'application Express
const app = express();

// =================================================================
// MIDDLEWARES GLOBAUX
// =================================================================

/**
 * Middleware pour parser les requêtes JSON
 * Permet de lire le corps des requêtes au format JSON
 */
app.use(express.json());

// =================================================================
// DOCUMENTATION API (SWAGGER)
// =================================================================

/**
 * Configuration de Swagger UI pour la documentation interactive
 * Accessible à l'URL /api-docs
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Recettes - Documentation",
}));

// Endpoint pour récupérer le fichier swagger.json
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// =================================================================
// ROUTES
// =================================================================

/**
 * Route racine - Informations sur l'API
 * GET /
 * Retourne les informations de base et les endpoints disponibles
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue sur l'API des recettes de cuisine",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      recettes: "/recettes",
      utilisateurs: "/utilisateurs",
    },
  });
});

// Import des routes
const recettesRoutes = require("./routes/recettes");
const utilisateursRoutes = require("./routes/utilisateurs");

/**
 * Routes pour la gestion des recettes
 * Préfixe: /recettes
 */
app.use("/recettes", recettesRoutes);

/**
 * Routes pour la gestion des utilisateurs et l'authentification
 * Préfixe: /utilisateurs
 */
app.use("/utilisateurs", utilisateursRoutes);

// =================================================================
// GESTION DES ERREURS
// =================================================================

/**
 * Middleware pour les routes non trouvées (404)
 * Doit être placé après toutes les routes
 */
app.use(notFound);

/**
 * Middleware global de gestion des erreurs
 * Doit être le DERNIER middleware enregistré
 */
app.use(errorHandler);

module.exports = app;
