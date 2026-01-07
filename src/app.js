const express = require("express");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "L'API des recettes fonctionne",
    version: "1.0.0",
    endpoints: {
      recettes: "/recettes",
      utilisateurs: "/utilisateurs",
    },
  });
});

// Routes
const recettesRoutes = require("./routes/recettes");
const utilisateursRoutes = require("./routes/utilisateurs");

app.use("/recettes", recettesRoutes);
app.use("/utilisateurs", utilisateursRoutes);

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
