/**
 * =================================================================
 * Modèle Mongoose pour les Recettes
 * =================================================================
 * 
 * Définit la structure des documents recettes dans MongoDB.
 * Inclut également le schéma des commentaires (sous-document).
 */

const mongoose = require("mongoose");

// =================================================================
// SCHÉMA DES COMMENTAIRES (sous-document)
// =================================================================

/**
 * Schéma pour les commentaires associés à une recette
 * Les commentaires sont stockés comme sous-documents de la recette
 * 
 * @property {String} auteur - Nom de l'auteur du commentaire
 * @property {String} contenu - Texte du commentaire (max 500 caractères)
 * @property {Date} date - Date de création (automatique)
 */
const commentaireSchema = new mongoose.Schema({
  auteur: {
    type: String,
    required: [true, "L'auteur du commentaire est obligatoire"],
    trim: true,
  },
  contenu: {
    type: String,
    required: [true, "Le contenu du commentaire est obligatoire"],
    trim: true,
    maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// =================================================================
// SCHÉMA PRINCIPAL DE LA RECETTE
// =================================================================

/**
 * Schéma Mongoose pour une recette de cuisine
 * 
 * @property {String} titre - Titre de la recette (3-100 caractères)
 * @property {String[]} ingredients - Liste des ingrédients nécessaires
 * @property {String[]} etapes - Étapes de préparation ordonnées
 * @property {String} auteur - Nom de l'auteur de la recette
 * @property {Date} date - Date de création (automatique)
 * @property {Number} popularite - Score de popularité (likes + commentaires)
 * @property {Array} commentaires - Liste des commentaires
 */
const recetteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre est obligatoire"],
    trim: true,
    minlength: [3, "Le titre doit contenir au moins 3 caractères"],
    maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
  },
  ingredients: {
    type: [String],
    required: [true, "Les ingrédients sont obligatoires"],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "Au moins un ingrédient est requis",
    },
  },
  etapes: {
    type: [String],
    required: [true, "Les étapes sont obligatoires"],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "Au moins une étape est requise",
    },
  },
  auteur: {
    type: String,
    required: [true, "L'auteur est obligatoire"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  popularite: {
    type: Number,
    default: 0,
    min: [0, "La popularité ne peut pas être négative"],
  },
  commentaires: [commentaireSchema],
});

// =================================================================
// INDEX POUR OPTIMISATION DES REQUÊTES
// =================================================================

/**
 * Index MongoDB pour améliorer les performances des recherches
 * - auteur: tri et recherche par auteur
 * - date: tri chronologique des recettes
 * - popularite: tri par popularité
 * - ingredients: recherche par ingrédient
 */
recetteSchema.index({ auteur: 1 });      // Index ascendant sur l'auteur
recetteSchema.index({ date: -1 });        // Index descendant sur la date
recetteSchema.index({ popularite: -1 });  // Index descendant sur la popularité
recetteSchema.index({ ingredients: 1 }); // Index pour la recherche d'ingrédients

// Export du modèle
module.exports = mongoose.model("Recette", recetteSchema);
