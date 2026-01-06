const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Veuillez fournir un email valide"],
  },
  motDePasse: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
