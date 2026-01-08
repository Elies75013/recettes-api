const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs");
const { genererToken } = require("../middleware/auth");
const { ApiError } = require("../middleware/errorHandler");

/**
 * Inscription d'un nouvel utilisateur
 */
exports.inscription = async (req, res, next) => {
  try {
    const { nom, email, motDePasse } = req.body;

    // Vérifier si l'email existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      throw new ApiError(409, "Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    // Créer l'utilisateur
    const utilisateur = new Utilisateur({
      nom,
      email,
      motDePasse: motDePasseHash,
    });

    await utilisateur.save();

    // Générer le token
    const token = genererToken(utilisateur);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.connexion = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    // Générer le token
    const token = genererToken(utilisateur);

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir le profil de l'utilisateur connecté
 */
exports.profil = async (req, res, next) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id).select("-motDePasse");
    
    if (!utilisateur) {
      throw new ApiError(404, "Utilisateur non trouvé");
    }

    res.json({
      success: true,
      data: utilisateur,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir tous les utilisateurs (sans les mots de passe)
 */
exports.obtenirUtilisateurs = async (req, res, next) => {
  try {
    const utilisateurs = await Utilisateur.find().select("-motDePasse");

    res.json({
      success: true,
      data: utilisateurs,
    });
  } catch (error) {
    next(error);
  }
};
