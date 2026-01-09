/**
 * =================================================================
 * Modèle Mongoose pour les Utilisateurs
 * =================================================================
 * 
 * Définit la structure des documents utilisateurs dans MongoDB.
 * Utilisé pour l'authentification et la gestion des comptes.
 */

const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour un utilisateur
 * 
 * @property {String} nom - Nom d'affichage de l'utilisateur
 * @property {String} email - Adresse email unique (utilisée pour la connexion)
 * @property {String} motDePasse - Mot de passe hashé (bcrypt)
 * @property {Date} createdAt - Date de création (automatique via timestamps)
 * @property {Date} updatedAt - Date de dernière modification (automatique)
 */
const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,      // Garantit l'unicité de l'email
    lowercase: true,   // Convertit en minuscules automatiquement
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Veuillez fournir un email valide"],
  },
  motDePasse: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    // Note: Le mot de passe est hashé dans le contrôleur avant sauvegarde
  },
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Export du modèle
module.exports = mongoose.model("Utilisateur", utilisateurSchema);
