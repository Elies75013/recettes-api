const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
require("dotenv").config();
const connectDB = require("./src/config/db");

connectDB(); 
