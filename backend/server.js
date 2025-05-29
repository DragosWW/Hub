
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const passport = require('passport'); 
const path = require('path');

const authRoutes = require('./routes/authRoutes');

require('./config/passport-setup'); 


connectDB();

const app = express(); 


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(passport.initialize()); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('API-ul backend rulează...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server backend pornit pe portul ${PORT} (Timestamp: ${new Date().toLocaleTimeString('ro-RO')})`));