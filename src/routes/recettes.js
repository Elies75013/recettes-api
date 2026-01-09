/**
 * =================================================================
 * Routes des Recettes
 * =================================================================
 * 
 * Ce fichier définit toutes les routes pour la gestion des recettes.
 * Chaque route est documentée avec Swagger pour l'API.
 * 
 * Routes disponibles:
 * - POST   /recettes              : Créer une recette (auth requise)
 * - GET    /recettes              : Lister les recettes (filtres/pagination)
 * - GET    /recettes/:id          : Détail d'une recette
 * - PUT    /recettes/:id          : Modifier une recette (auth requise)
 * - DELETE /recettes/:id          : Supprimer une recette (auth requise)
 * - POST   /recettes/:id/aimer    : Aimer une recette
 * - GET    /recettes/:id/commentaires    : Lister les commentaires
 * - POST   /recettes/:id/commentaires    : Ajouter un commentaire
 * - DELETE /recettes/:id/commentaires/:commentaireId : Supprimer un commentaire
 */

const express = require("express");
const router = express.Router();
const recettesController = require("../controllers/recettesController");
const { authentifier, authentifierOptionnel } = require("../middleware/auth");
const {
  validerRecette,
  validerRecetteModification,
  validerIdMongo,
  validerCommentaire,
  validerFiltrage,
} = require("../middleware/validators");

/**
 * @swagger
 * /recettes:
 *   post:
 *     summary: Créer une nouvelle recette
 *     tags: [Recettes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecetteInput'
 *     responses:
 *       201:
 *         description: Recette créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recette créée avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Recette'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       401:
 *         $ref: '#/components/responses/NonAutorise'
 */
router.post("/", authentifier, validerRecette, recettesController.creerRecette);

/**
 * @swagger
 * /recettes:
 *   get:
 *     summary: Obtenir toutes les recettes avec filtrage et pagination
 *     tags: [Recettes]
 *     parameters:
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Filtrer par ingrédient (recherche partielle)
 *         example: tomate
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur (recherche partielle)
 *         example: chef
 *       - in: query
 *         name: tri
 *         schema:
 *           type: string
 *           enum: [date, -date, popularite, -popularite]
 *         description: "Tri des résultats (préfixe - pour décroissant)"
 *         example: -popularite
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste des recettes
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
 *                     $ref: '#/components/schemas/Recette'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", validerFiltrage, recettesController.obtenirRecettes);

/**
 * @swagger
 * /recettes/{id}:
 *   get:
 *     summary: Obtenir une recette par son ID
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Détails de la recette
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Recette'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.get("/:id", validerIdMongo, recettesController.obtenirRecetteParId);

/**
 * @swagger
 * /recettes/{id}:
 *   put:
 *     summary: Modifier une recette
 *     tags: [Recettes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecetteInput'
 *     responses:
 *       200:
 *         description: Recette modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recette modifiée avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Recette'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       401:
 *         $ref: '#/components/responses/NonAutorise'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.put("/:id", authentifier, validerIdMongo, validerRecetteModification, recettesController.modifierRecette);

/**
 * @swagger
 * /recettes/{id}:
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recettes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette à supprimer
 *     responses:
 *       200:
 *         description: Recette supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recette supprimée avec succès
 *       401:
 *         $ref: '#/components/responses/NonAutorise'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.delete("/:id", authentifier, validerIdMongo, recettesController.supprimerRecette);

/**
 * @swagger
 * /recettes/{id}/like:
 *   post:
 *     summary: Aimer une recette (augmente la popularité)
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette à aimer
 *     responses:
 *       200:
 *         description: Like ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Like ajouté avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Recette'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.post("/:id/like", validerIdMongo, recettesController.aimerRecette);

// --- Routes pour les commentaires ---

/**
 * @swagger
 * /recettes/{id}/commentaires:
 *   post:
 *     summary: Ajouter un commentaire à une recette
 *     tags: [Commentaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentaireInput'
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Commentaire ajouté avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Recette'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.post(
  "/:id/commentaires",
  validerIdMongo,
  validerCommentaire,
  recettesController.ajouterCommentaire
);

/**
 * @swagger
 * /recettes/{id}/commentaires:
 *   get:
 *     summary: Obtenir les commentaires d'une recette
 *     tags: [Commentaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Liste des commentaires
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
 *                     $ref: '#/components/schemas/Commentaire'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.get("/:id/commentaires", validerIdMongo, recettesController.obtenirCommentaires);

/**
 * @swagger
 * /recettes/{id}/commentaires/{commentaireId}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *       - in: path
 *         name: commentaireId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Commentaire supprimé avec succès
 *       401:
 *         $ref: '#/components/responses/NonAutorise'
 *       404:
 *         $ref: '#/components/responses/NonTrouve'
 */
router.delete(
  "/:id/commentaires/:commentaireId",
  authentifier,
  validerIdMongo,
  recettesController.supprimerCommentaire
);

module.exports = router;
