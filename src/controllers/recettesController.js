const Recette = require("../models/Recette");

// Ajouter une recette
exports.creerRecette = async (req, res) => {
  try {
    const recette = new Recette(req.body);
    const nouvelleRecette = await recette.save();
    res.status(201).json(nouvelleRecette);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lire toutes les recettes
exports.obtenirRecettes = async (req, res) => {
  try {
    const recettes = await Recette.find();
    res.json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lire une recette par ID
exports.obtenirRecetteParId = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.json(recette);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une recette
exports.modifierRecette = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.json(recette);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une recette
exports.supprimerRecette = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndDelete(req.params.id);
    if (!recette) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.json({ message: "Recette supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
