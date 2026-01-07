const Recette = require("../models/Recette");
const { ApiError } = require("../middleware/errorHandler");

// Ajouter une recette
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

// Lire toutes les recettes avec filtrage et tri
exports.obtenirRecettes = async (req, res, next) => {
  try {
    const { ingredient, auteur, tri, page = 1, limite = 10 } = req.query;

    // Construction du filtre
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

// Lire une recette par ID
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

// Modifier une recette
exports.modifierRecette = async (req, res, next) => {
  try {
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

// Supprimer une recette
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

// Ajouter un commentaire à une recette
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

// Obtenir les commentaires d'une recette
exports.obtenirCommentaires = async (req, res, next) => {
  try {
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

// Supprimer un commentaire
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

// Augmenter la popularité (like)
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
