const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Recettes",
      version: "1.0.0",
      description: "API REST pour la gestion de recettes de cuisine",
      contact: {
        name: "Support API",
        email: "support@recettes-api.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez votre token JWT",
        },
      },
      schemas: {
        Recette: {
          type: "object",
          required: ["titre", "ingredients", "etapes", "auteur"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de la recette",
              example: "507f1f77bcf86cd799439011",
            },
            titre: {
              type: "string",
              description: "Titre de la recette",
              minLength: 3,
              maxLength: 100,
              example: "Tarte aux pommes",
            },
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "Liste des ingrédients",
              example: ["500g de pommes", "200g de farine", "100g de sucre"],
            },
            etapes: {
              type: "array",
              items: { type: "string" },
              description: "Étapes de préparation",
              example: ["Préchauffer le four à 180°C", "Éplucher les pommes"],
            },
            auteur: {
              type: "string",
              description: "Nom de l'auteur de la recette",
              example: "Chef Martin",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date de création",
            },
            popularite: {
              type: "integer",
              description: "Score de popularité",
              default: 0,
              example: 42,
            },
            commentaires: {
              type: "array",
              items: { $ref: "#/components/schemas/Commentaire" },
            },
          },
        },
        RecetteInput: {
          type: "object",
          required: ["titre", "ingredients", "etapes", "auteur"],
          properties: {
            titre: {
              type: "string",
              description: "Titre de la recette",
              minLength: 3,
              maxLength: 100,
              example: "Tarte aux pommes",
            },
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "Liste des ingrédients",
              example: ["500g de pommes", "200g de farine", "100g de sucre"],
            },
            etapes: {
              type: "array",
              items: { type: "string" },
              description: "Étapes de préparation",
              example: ["Préchauffer le four à 180°C", "Éplucher les pommes"],
            },
            auteur: {
              type: "string",
              description: "Nom de l'auteur de la recette",
              example: "Chef Martin",
            },
          },
        },
        Commentaire: {
          type: "object",
          required: ["auteur", "contenu"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique du commentaire",
            },
            auteur: {
              type: "string",
              description: "Auteur du commentaire",
              example: "Marie",
            },
            contenu: {
              type: "string",
              description: "Contenu du commentaire",
              maxLength: 500,
              example: "Excellente recette, merci !",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date du commentaire",
            },
          },
        },
        CommentaireInput: {
          type: "object",
          required: ["auteur", "contenu"],
          properties: {
            auteur: {
              type: "string",
              description: "Auteur du commentaire",
              example: "Marie",
            },
            contenu: {
              type: "string",
              description: "Contenu du commentaire",
              maxLength: 500,
              example: "Excellente recette, merci !",
            },
          },
        },
        Utilisateur: {
          type: "object",
          required: ["nom", "email", "motDePasse"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'utilisateur",
            },
            nom: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Jean Dupont",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
              example: "jean@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du compte",
            },
          },
        },
        InscriptionInput: {
          type: "object",
          required: ["nom", "email", "motDePasse"],
          properties: {
            nom: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Jean Dupont",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
              example: "jean@example.com",
            },
            motDePasse: {
              type: "string",
              format: "password",
              description: "Mot de passe (min 6 caractères)",
              minLength: 6,
              example: "motdepasse123",
            },
          },
        },
        ConnexionInput: {
          type: "object",
          required: ["email", "motDePasse"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
              example: "jean@example.com",
            },
            motDePasse: {
              type: "string",
              format: "password",
              description: "Mot de passe",
              example: "motdepasse123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Connexion réussie",
            },
            token: {
              type: "string",
              description: "Token JWT",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            utilisateur: {
              type: "object",
              properties: {
                id: { type: "string" },
                nom: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
        Erreur: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Une erreur est survenue",
            },
            details: {
              type: "array",
              items: { type: "string" },
              nullable: true,
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limite: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 50,
            },
            pages: {
              type: "integer",
              example: 5,
            },
          },
        },
      },
      responses: {
        NonAutorise: {
          description: "Non autorisé - Token manquant ou invalide",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Erreur",
              },
              example: {
                success: false,
                message: "Accès non autorisé. Token manquant.",
              },
            },
          },
        },
        NonTrouve: {
          description: "Ressource non trouvée",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Erreur",
              },
              example: {
                success: false,
                message: "Recette non trouvée",
              },
            },
          },
        },
        ErreurValidation: {
          description: "Erreur de validation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Erreur",
              },
              example: {
                success: false,
                message: "Erreur de validation",
                details: ["Le titre est obligatoire"],
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Recettes",
        description: "Opérations sur les recettes",
      },
      {
        name: "Commentaires",
        description: "Gestion des commentaires sur les recettes",
      },
      {
        name: "Authentification",
        description: "Inscription, connexion et gestion des tokens",
      },
      {
        name: "Utilisateurs",
        description: "Gestion des utilisateurs",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
