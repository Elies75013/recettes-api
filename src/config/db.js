/**
 * =================================================================
 * Configuration de la connexion à MongoDB
 * =================================================================
 * 
 * Ce module gère la connexion à la base de données MongoDB
 * en utilisant Mongoose comme ODM (Object Document Mapper).
 */

const mongoose = require("mongoose");

/**
 * Établit la connexion à la base de données MongoDB
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Arrête le processus si la connexion échoue
 * 
 * @example
 * // Dans server.js
 * const connectDB = require('./src/config/db');
 * connectDB();
 */
const connectDB = async () => {
  try {
    // Connexion à MongoDB avec l'URI définie dans les variables d'environnement
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    // En cas d'erreur, afficher le message et arrêter l'application
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    process.exit(1); // Code 1 = erreur
  }
};

module.exports = connectDB;
