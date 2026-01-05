const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Liste des utilisateurs OK");
});

module.exports = router;
