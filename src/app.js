const express = require("express");

const app = express();
// Middleware pour parser le JSON
app.use(express.json());
app.get("/", (req, res) => {
  res.send("L’API des recettes fonctionne ");
});
const recettesRoutes = require("./routes/recettes");
const utilisateursRoutes = require("./routes/utilisateurs");

app.use("/recettes", recettesRoutes);
app.use("/utilisateurs", utilisateursRoutes);

module.exports = app;
