/**
 * =================================================================
 * Routes des Utilisateurs et Authentification
 * =================================================================
 * 
 * Ce fichier définit les routes pour la gestion des utilisateurs
 * et l'authentification JWT.
 * 
 * Routes disponibles:
 * - POST /utilisateurs/inscription : Créer un compte
 * - POST /utilisateurs/connexion   : Se connecter (obtenir un token)
 * - GET  /utilisateurs/profil      : Voir son profil (auth requise)
 * - GET  /utilisateurs             : Lister tous les utilisateurs
 */

const express = require("express");
const router = express.Router();
const utilisateursController = require("../controllers/utilisateursController");
const { authentifier } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { ApiError } = require("../middleware/errorHandler");

// =================================================================
// MIDDLEWARES DE VALIDATION
// =================================================================

/**
 * Validation pour l'inscription d'un nouvel utilisateur
 * 
 * Champs validés:
 * - nom: 2-50 caractères
 * - email: format email valide
 * - motDePasse: minimum 6 caractères
 */
const validerInscription = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("Veuillez fournir un email valide")
    .normalizeEmail(),
  body("motDePasse")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array().map((err) => err.msg);
      return next(new ApiError(400, "Erreur de validation", details));
    }
    next();
  },
];

/**
 * Validation pour la connexion d'un utilisateur
 * 
 * Champs validés:
 * - email: format email valide
 * - motDePasse: non vide
 */
const validerConnexion = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("Veuillez fournir un email valide")
    .normalizeEmail(),
  body("motDePasse")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array().map((err) => err.msg);
      return next(new ApiError(400, "Erreur de validation", details));
    }
    next();
  },
];

/**
 * @swagger
 * /utilisateurs/inscription:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InscriptionInput'
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erreur'
 */
router.post("/inscription", validerInscription, utilisateursController.inscription);

/**
 * @swagger
 * /utilisateurs/connexion:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnexionInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erreur'
 */
router.post("/connexion", validerConnexion, utilisateursController.connexion);

/**
 * @swagger
 * /utilisateurs/profil:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         $ref: '#/components/responses/NonAutorise'
 */
router.get("/profil", authentifier, utilisateursController.profil);

/**
 * @swagger
 * /utilisateurs:
 *   get:
 *     summary: Obtenir la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Utilisateur'
 */
router.get("/", utilisateursController.obtenirUtilisateurs);

module.exports = router;
