const mongoose = require("mongoose");

const recetteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre est obligatoire"],
    trim: true,
  },
  ingredients: {
    type: [String],
    required: [true, "Les ingrédients sont obligatoires"],
  },
  etapes: {
    type: [String],
    required: [true, "Les étapes sont obligatoires"],
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
});

module.exports = mongoose.model("Recette", recetteSchema);
