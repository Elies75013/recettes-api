/**
 * =================================================================
 * Middlewares de Validation
 * =================================================================
 * 
 * Ce module utilise express-validator pour valider les données
 * des requêtes avant qu'elles n'atteignent les contrôleurs.
 */

const { body, param, query, validationResult } = require("express-validator");
const { ApiError } = require("./errorHandler");

// =================================================================
// MIDDLEWARE DE BASE
// =================================================================

/**
 * Middleware pour vérifier les résultats de validation
 * À utiliser en dernier dans la chaîne de validation
 * 
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Fonction next
 * @throws {ApiError} 400 si des erreurs de validation sont présentes
 */
const validerResultat = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Formate les erreurs pour une réponse claire
    const details = errors.array().map((err) => ({
      champ: err.path,
      message: err.msg,
      valeur: err.value,
    }));
    throw new ApiError(400, "Erreur de validation des données", details);
  }
  next();
};

// =================================================================
// VALIDATION DES RECETTES
// =================================================================

/**
 * Validation pour la création d'une recette
 * Tous les champs sont obligatoires
 * 
 * Champs validés:
 * - titre: 3-100 caractères, non vide
 * - ingredients: tableau non vide de chaînes
 * - etapes: tableau non vide de chaînes
 * - auteur: non vide
 */
const validerRecette = [
  body("titre")
    .trim()
    .notEmpty()
    .withMessage("Le titre est obligatoire")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre doit contenir entre 3 et 100 caractères"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Au moins un ingrédient est requis"),

  body("ingredients.*")
    .trim()
    .notEmpty()
    .withMessage("Chaque ingrédient doit être non vide"),

  body("etapes")
    .isArray({ min: 1 })
    .withMessage("Au moins une étape est requise"),

  body("etapes.*")
    .trim()
    .notEmpty()
    .withMessage("Chaque étape doit être non vide"),

  body("auteur")
    .trim()
    .notEmpty()
    .withMessage("L'auteur est obligatoire"),

  validerResultat,
];

/**
 * Validation pour la modification d'une recette
 * Tous les champs sont optionnels mais validés s'ils sont présents
 */
const validerRecetteModification = [
  body("titre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le titre ne peut pas être vide")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre doit contenir entre 3 et 100 caractères"),

  body("ingredients")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Au moins un ingrédient est requis"),

  body("ingredients.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Chaque ingrédient doit être non vide"),

  body("etapes")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Au moins une étape est requise"),

  body("etapes.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Chaque étape doit être non vide"),

  body("auteur")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("L'auteur ne peut pas être vide"),

  validerResultat,
];

// =================================================================
// VALIDATION DES PARAMÈTRES
// =================================================================

/**
 * Validation d'un ID MongoDB dans les paramètres d'URL
 * Vérifie que l'ID est un ObjectId valide (24 caractères hex)
 */
const validerIdMongo = [
  param("id")
    .isMongoId()
    .withMessage("ID invalide"),
  validerResultat,
];

// =================================================================
// VALIDATION DES COMMENTAIRES
// =================================================================

/**
 * Validation pour l'ajout d'un commentaire
 * 
 * Champs validés:
 * - auteur: obligatoire, non vide
 * - contenu: obligatoire, max 500 caractères
 */
const validerCommentaire = [
  body("auteur")
    .trim()
    .notEmpty()
    .withMessage("L'auteur du commentaire est obligatoire"),

  body("contenu")
    .trim()
    .notEmpty()
    .withMessage("Le contenu du commentaire est obligatoire")
    .isLength({ max: 500 })
    .withMessage("Le commentaire ne peut pas dépasser 500 caractères"),

  validerResultat,
];

// =================================================================
// VALIDATION DES QUERY PARAMS (FILTRAGE/TRI)
// =================================================================

/**
 * Validation des paramètres de filtrage et pagination
 * Tous les paramètres sont optionnels
 * 
 * Paramètres:
 * - ingredient: filtre par ingrédient
 * - auteur: filtre par auteur
 * - tri: date, -date, popularite, -popularite
 * - page: entier >= 1
 * - limite: entier entre 1 et 100
 */
const validerFiltrage = [
  query("ingredient")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("L'ingrédient ne peut pas être vide"),

  query("auteur")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("L'auteur ne peut pas être vide"),

  query("tri")
    .optional()
    .isIn(["date", "popularite", "-date", "-popularite"])
    .withMessage("Les valeurs de tri acceptées sont: date, popularite, -date, -popularite"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La page doit être un entier positif"),

  query("limite")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  validerResultat,
];

module.exports = {
  validerResultat,
  validerRecette,
  validerRecetteModification,
  validerIdMongo,
  validerCommentaire,
  validerFiltrage,
};
