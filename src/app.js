const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("L’API des recettes fonctionne ");
});

module.exports = app;
