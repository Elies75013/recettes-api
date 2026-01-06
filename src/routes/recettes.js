const express = require("express");
const router = express.Router();
const recettesController = require("../controllers/recettesController");

// POST /recettes - Ajouter une recette
router.post("/", recettesController.creerRecette);

// GET /recettes - Lire toutes les recettes
router.get("/", recettesController.obtenirRecettes);

// GET /recettes/:id - Lire une recette par ID
router.get("/:id", recettesController.obtenirRecetteParId);

// PUT /recettes/:id - Modifier une recette
router.put("/:id", recettesController.modifierRecette);

// DELETE /recettes/:id - Supprimer une recette
router.delete("/:id", recettesController.supprimerRecette);

module.exports = router;
