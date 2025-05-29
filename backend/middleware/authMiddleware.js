
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
require('dotenv').config();

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ msg: 'Neautorizat, utilizator negăsit pentru acest token' });
      }

      next(); 
    } catch (error) {
      console.error('Eroare la verificarea token-ului:', error);
      res.status(401).json({ msg: 'Neautorizat, token invalid' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Neautorizat, lipsește token-ul' });
  }
};