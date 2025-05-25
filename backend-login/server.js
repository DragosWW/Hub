// server.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); // Încarcă variabilele de mediu PRIMUL!

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Funcția de conectare la MongoDB
const passport = require('passport'); // Pentru autentificarea cu Google
const path = require('path');
// Importă DOAR fișierul principal de rute pentru autentificare (care acum conține și rutele pentru evenimente salvate)
const authRoutes = require('./routes/authRoutes');

require('./config/passport-setup'); // Inițializează configurarea Passport (strategia Google etc.)

// Conectare la baza de date MongoDB
connectDB();

const app = express(); // Definește instanța Express

// Middleware-uri Esențiale
app.use(cors()); // Permite cereri Cross-Origin
app.use(express.json()); // Pentru a parsa body-urile cererilor JSON
app.use(express.urlencoded({ extended: false })); // Pentru a parsa body-urile URL-encoded
app.use(passport.initialize()); // Inițializează Passport pentru fiecare cerere (important pentru rutele Google)
app.use(express.static(path.join(__dirname, 'public'))); 
// Montarea Rutelor API Principale
// Toate rutele definite în authRoutes.js vor fi prefixate cu /api/auth
app.use('/api/auth', authRoutes);

// O rută simplă de test pentru rădăcina API-ului
app.get('/', (req, res) => {
  res.send('API-ul backend rulează...');
});

// Definirea Portului și Pornirea Serverului
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server backend pornit pe portul ${PORT} (Timestamp: ${new Date().toLocaleTimeString('ro-RO')})`));