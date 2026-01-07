// Classe personnalisée pour les erreurs API
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur interne du serveur";
  let details = err.details || null;

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Erreur de validation";
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Erreur de cast Mongoose (ID invalide)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Format invalide pour ${err.path}: ${err.value}`;
  }

  // Erreur de duplication MongoDB
  if (err.code === 11000) {
    statusCode = 409;
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

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route non trouvée: ${req.originalUrl}`);
  next(error);
};

module.exports = { ApiError, errorHandler, notFound };
