const { body, param, query, validationResult } = require("express-validator");
const { ApiError } = require("./errorHandler");

// Middleware pour vérifier les résultats de validation
const validerResultat = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      champ: err.path,
      message: err.msg,
      valeur: err.value,
    }));
    throw new ApiError(400, "Erreur de validation des données", details);
  }
  next();
};

// Validation pour créer/modifier une recette
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

// Validation pour modifier une recette (champs optionnels)
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

// Validation d'un ID MongoDB
const validerIdMongo = [
  param("id")
    .isMongoId()
    .withMessage("ID invalide"),
  validerResultat,
];

// Validation pour un commentaire
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

// Validation des paramètres de requête pour le filtrage/tri
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
