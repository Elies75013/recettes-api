const express = require("express");
const router = express.Router();

// GET /recettes
router.get("/", (req, res) => {
  res.send("Liste des recettes OK");
});

module.exports = router;
