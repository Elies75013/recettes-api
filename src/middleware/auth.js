const jwt = require("jsonwebtoken");
const { ApiError } = require("./errorHandler");

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_super_securise_2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} utilisateur - L'utilisateur pour lequel générer le token
 * @returns {string} Le token JWT
 */
const genererToken = (utilisateur) => {
  return jwt.sign(
    {
      id: utilisateur._id,
      email: utilisateur.email,
      nom: utilisateur.nom,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Middleware pour vérifier l'authentification JWT
 * Vérifie que le token est présent et valide
 */
const authentifier = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Accès non autorisé. Token manquant.");
    }

    // Le format attendu est "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(401, "Format du token invalide. Utilisez: Bearer <token>");
    }

    const token = parts[1];

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter les infos de l'utilisateur à la requête
    req.utilisateur = {
      id: decoded.id,
      email: decoded.email,
      nom: decoded.nom,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Token invalide"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token expiré. Veuillez vous reconnecter."));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Erreur lors de la vérification du token"));
    }
  }
};

/**
 * Middleware optionnel d'authentification
 * Ajoute les infos utilisateur si un token valide est présent, sinon continue
 */
const authentifierOptionnel = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next();
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.utilisateur = {
      id: decoded.id,
      email: decoded.email,
      nom: decoded.nom,
    };

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};

module.exports = {
  genererToken,
  authentifier,
  authentifierOptionnel,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
