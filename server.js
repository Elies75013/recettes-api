require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

