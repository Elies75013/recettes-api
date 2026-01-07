const express = require("express");
const router = express.Router();
const recettesController = require("../controllers/recettesController");
const {
  validerRecette,
  validerRecetteModification,
  validerIdMongo,
  validerCommentaire,
  validerFiltrage,
} = require("../middleware/validators");

// POST /recettes - Ajouter une recette
router.post("/", validerRecette, recettesController.creerRecette);

// GET /recettes - Lire toutes les recettes (avec filtrage et tri)
// Exemples:
// - GET /recettes?ingredient=tomate
// - GET /recettes?auteur=chef
// - GET /recettes?tri=-popularite
// - GET /recettes?page=2&limite=5
router.get("/", validerFiltrage, recettesController.obtenirRecettes);

// GET /recettes/:id - Lire une recette par ID
router.get("/:id", validerIdMongo, recettesController.obtenirRecetteParId);

// PUT /recettes/:id - Modifier une recette
router.put("/:id", validerIdMongo, validerRecetteModification, recettesController.modifierRecette);

// DELETE /recettes/:id - Supprimer une recette
router.delete("/:id", validerIdMongo, recettesController.supprimerRecette);

// POST /recettes/:id/like - Aimer une recette (augmente la popularité)
router.post("/:id/like", validerIdMongo, recettesController.aimerRecette);

// --- Routes pour les commentaires ---

// POST /recettes/:id/commentaires - Ajouter un commentaire
router.post(
  "/:id/commentaires",
  validerIdMongo,
  validerCommentaire,
  recettesController.ajouterCommentaire
);

// GET /recettes/:id/commentaires - Obtenir les commentaires d'une recette
router.get("/:id/commentaires", validerIdMongo, recettesController.obtenirCommentaires);

// DELETE /recettes/:id/commentaires/:commentaireId - Supprimer un commentaire
router.delete(
  "/:id/commentaires/:commentaireId",
  validerIdMongo,
  recettesController.supprimerCommentaire
);

module.exports = router;
