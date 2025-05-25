// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asigură-te că ai importat modelul User
require('dotenv').config();

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrage token-ul din header (Bearer TOKEN_AICI)
      token = req.headers.authorization.split(' ')[1];

      // Verifică token-ul
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adaugă utilizatorul (fără parolă) la obiectul request pentru a fi disponibil în controller
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ msg: 'Neautorizat, utilizator negăsit pentru acest token' });
      }

      next(); // Continuă la următorul middleware sau la controller-ul rutei
    } catch (error) {
      console.error('Eroare la verificarea token-ului:', error);
      res.status(401).json({ msg: 'Neautorizat, token invalid' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Neautorizat, lipsește token-ul' });
  }
};