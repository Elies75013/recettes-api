/**
 * =================================================================
 * Contrôleur des Recettes
 * =================================================================
 * 
 * Ce module contient toutes les fonctions de contrôle pour
 * la gestion des recettes (CRUD) et des commentaires.
 */

const Recette = require("../models/Recette");
const { ApiError } = require("../middleware/errorHandler");

// =================================================================
// GESTION DES RECETTES (CRUD)
// =================================================================

/**
 * Créer une nouvelle recette
 * POST /recettes
 * 
 * @param {Request} req - Corps: { titre, ingredients, etapes, auteur }
 * @param {Response} res - Renvoie la recette créée
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 */
exports.creerRecette = async (req, res, next) => {
  try {
    const recette = new Recette(req.body);
    const nouvelleRecette = await recette.save();
    res.status(201).json({
      success: true,
      message: "Recette créée avec succès",
      data: nouvelleRecette,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer toutes les recettes avec filtrage, tri et pagination
 * GET /recettes
 * 
 * @param {Request} req - Query params: { ingredient?, auteur?, tri?, page?, limite? }
 * @param {Response} res - Liste paginée des recettes
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * 
 * Filtres disponibles:
 * - ingredient: recherche partielle insensible à la casse
 * - auteur: recherche partielle insensible à la casse
 * 
 * Tri disponible:
 * - date / -date: par date (croissant / décroissant)
 * - popularite / -popularite: par popularité
 */
exports.obtenirRecettes = async (req, res, next) => {
  try {
    const { ingredient, auteur, tri, page = 1, limite = 10 } = req.query;

    // -----------------------------------------------------------------
    // Construction du filtre MongoDB
    // -----------------------------------------------------------------
    const filtre = {};

    // Filtrage par ingrédient (recherche partielle insensible à la casse)
    if (ingredient) {
      filtre.ingredients = { $regex: ingredient, $options: "i" };
    }

    // Filtrage par auteur (recherche partielle insensible à la casse)
    if (auteur) {
      filtre.auteur = { $regex: auteur, $options: "i" };
    }

    // Construction du tri
    let triOption = { date: -1 }; // Par défaut, tri par date décroissante

    if (tri) {
      switch (tri) {
        case "date":
          triOption = { date: 1 };
          break;
        case "-date":
          triOption = { date: -1 };
          break;
        case "popularite":
          triOption = { popularite: 1 };
          break;
        case "-popularite":
          triOption = { popularite: -1 };
          break;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limite);
    const limiteInt = parseInt(limite);

    // Exécution de la requête
    const [recettes, total] = await Promise.all([
      Recette.find(filtre)
        .sort(triOption)
        .skip(skip)
        .limit(limiteInt),
      Recette.countDocuments(filtre),
    ]);

    res.json({
      success: true,
      data: recettes,
      pagination: {
        page: parseInt(page),
        limite: limiteInt,
        total,
        pages: Math.ceil(total / limiteInt),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une recette par son ID
 * GET /recettes/:id
 * 
 * @param {Request} req - Param: id (ObjectId MongoDB)
 * @param {Response} res - Détails complets de la recette
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 */
exports.obtenirRecetteParId = async (req, res, next) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }
    res.json({
      success: true,
      data: recette,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier une recette existante
 * PUT /recettes/:id
 * 
 * @param {Request} req - Param: id, Corps: champs à modifier
 * @param {Response} res - Recette mise à jour
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 */
exports.modifierRecette = async (req, res, next) => {
  try {
    // findByIdAndUpdate avec options:
    // - new: true -> retourne le document modifié
    // - runValidators: true -> exécute les validations du schéma
    const recette = await Recette.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }
    res.json({
      success: true,
      message: "Recette modifiée avec succès",
      data: recette,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une recette
 * DELETE /recettes/:id
 * 
 * @param {Request} req - Param: id de la recette à supprimer
 * @param {Response} res - Message de confirmation
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 */
exports.supprimerRecette = async (req, res, next) => {
  try {
    const recette = await Recette.findByIdAndDelete(req.params.id);
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }
    res.json({
      success: true,
      message: "Recette supprimée avec succès",
    });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// GESTION DES COMMENTAIRES
// =================================================================

/**
 * Ajouter un commentaire à une recette
 * POST /recettes/:id/commentaires
 * 
 * @param {Request} req - Param: id, Corps: { auteur, contenu }
 * @param {Response} res - Recette avec le nouveau commentaire
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 * 
 * Note: Chaque commentaire augmente la popularité de la recette de 1
 */
exports.ajouterCommentaire = async (req, res, next) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }

    recette.commentaires.push({
      auteur: req.body.auteur,
      contenu: req.body.contenu,
    });

    // Augmenter la popularité à chaque commentaire
    recette.popularite += 1;

    await recette.save();

    res.status(201).json({
      success: true,
      message: "Commentaire ajouté avec succès",
      data: recette,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer tous les commentaires d'une recette
 * GET /recettes/:id/commentaires
 * 
 * @param {Request} req - Param: id de la recette
 * @param {Response} res - Liste des commentaires avec titre de la recette
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 */
exports.obtenirCommentaires = async (req, res, next) => {
  try {
    // Sélectionne uniquement les champs nécessaires pour optimiser
    const recette = await Recette.findById(req.params.id).select("commentaires titre");
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }

    res.json({
      success: true,
      data: {
        titre: recette.titre,
        commentaires: recette.commentaires,
        total: recette.commentaires.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un commentaire d'une recette
 * DELETE /recettes/:id/commentaires/:commentaireId
 * 
 * @param {Request} req - Params: id (recette), commentaireId
 * @param {Response} res - Message de confirmation
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette ou le commentaire n'existe pas
 * 
 * Note: La suppression diminue la popularité de 1 (minimum 0)
 */
exports.supprimerCommentaire = async (req, res, next) => {
  try {
    const { id, commentaireId } = req.params;

    const recette = await Recette.findById(id);
    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }

    const commentaire = recette.commentaires.id(commentaireId);
    if (!commentaire) {
      throw new ApiError(404, "Commentaire non trouvé");
    }

    commentaire.deleteOne();
    
    // Diminuer la popularité
    if (recette.popularite > 0) {
      recette.popularite -= 1;
    }

    await recette.save();

    res.json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// FONCTIONNALITÉS SOCIALES
// =================================================================

/**
 * Aimer une recette (augmenter la popularité)
 * POST /recettes/:id/aimer
 * 
 * @param {Request} req - Param: id de la recette
 * @param {Response} res - Nouvelle valeur de popularité
 * @param {Function} next - Fonction next pour la gestion d'erreurs
 * @throws {ApiError} 404 si la recette n'existe pas
 * 
 * Utilise l'opérateur $inc pour une incrémentation atomique
 */
exports.aimerRecette = async (req, res, next) => {
  try {
    const recette = await Recette.findByIdAndUpdate(
      req.params.id,
      { $inc: { popularite: 1 } },
      { new: true }
    );

    if (!recette) {
      throw new ApiError(404, "Recette non trouvée");
    }

    res.json({
      success: true,
      message: "Recette aimée",
      data: { popularite: recette.popularite },
    });
  } catch (error) {
    next(error);
  }
};
