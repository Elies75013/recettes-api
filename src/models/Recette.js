const mongoose = require("mongoose");

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

// Index pour améliorer les performances des recherches
recetteSchema.index({ auteur: 1 });
recetteSchema.index({ date: -1 });
recetteSchema.index({ popularite: -1 });
recetteSchema.index({ ingredients: 1 });

module.exports = mongoose.model("Recette", recetteSchema);
