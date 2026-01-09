/**
 * =================================================================
 * Gestionnaire d'erreurs centralisé
 * =================================================================
 * 
 * Ce module fournit une gestion cohérente des erreurs pour toute l'API.
 * Il inclut une classe d'erreur personnalisée et des middlewares.
 */

/**
 * Classe personnalisée pour les erreurs API
 * Permet de créer des erreurs avec un code HTTP et des détails
 * 
 * @class ApiError
 * @extends Error
 * @param {number} statusCode - Code HTTP de l'erreur (400, 401, 404, etc.)
 * @param {string} message - Message d'erreur à afficher
 * @param {any} details - Détails supplémentaires (optionnel)
 * 
 * @example
 * throw new ApiError(404, "Recette non trouvée");
 * throw new ApiError(400, "Validation échouée", ["Le titre est requis"]);
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distingue les erreurs opérationnelles des bugs
  }
}

/**
 * Middleware Express de gestion globale des erreurs
 * Capture toutes les erreurs et renvoie une réponse JSON formatée
 * 
 * @param {Error} err - L'erreur capturée
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Fonction next (non utilisée mais requise)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur interne du serveur";
  let details = err.details || null;

  // -----------------------------------------------------------------
  // Gestion des erreurs Mongoose spécifiques
  // -----------------------------------------------------------------

  // Erreur de validation Mongoose (champs requis, format, etc.)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Erreur de validation des données";
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Erreur de cast Mongoose (ID MongoDB invalide)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Format invalide pour ${err.path}: ${err.value}`;
  }

  // Erreur de duplication MongoDB (violation contrainte unique)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    message = "Donnée en double détectée";
    details = err.keyValue;
  }

  // Log de l'erreur en développement
  if (process.env.NODE_ENV === "development") {
    console.error("Erreur:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées (404)
 * À placer après toutes les routes définies
 * 
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Fonction next pour passer l'erreur
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route non trouvée: ${req.originalUrl}`);
  next(error);
};

// Export des fonctions et classes
module.exports = { ApiError, errorHandler, notFound };
