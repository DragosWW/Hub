// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Se asigură că variabilele din .env sunt încărcate

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opțiunile useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify
      // nu mai sunt necesare în Mongoose 6+ și pot cauza erori dacă sunt prezente.
      // Mongoose 6+ le gestionează implicit.
    });

    console.log(`MongoDB Conectat: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Eroare la conectarea MongoDB: ${error.message}`);
    process.exit(1); // Ieșire din proces cu eroare
  }
};

module.exports = connectDB;