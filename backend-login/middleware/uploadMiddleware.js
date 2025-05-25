// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directorul unde vor fi stocate avatarele
const avatarUploadPath = path.join(__dirname, '..', 'public', 'uploads', 'avatars');

// Asigură-te că directorul există
if (!fs.existsSync(avatarUploadPath)) {
  fs.mkdirSync(avatarUploadPath, { recursive: true });
}

// Configurare stocare pentru multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarUploadPath); // Directorul de destinație
  },
  filename: function (req, file, cb) {
    // Generează un nume unic pentru fișier pentru a evita coliziunile
    // Folosim ID-ul utilizatorului (dacă e disponibil) și timestamp-ul
    const userId = req.user ? req.user.id : 'unknownuser';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtru pentru a accepta doar imagini
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Tip de fișier nepermis! Sunt acceptate doar imagini (jpeg, jpg, png, gif).'), false);
};

const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limită la 5MB
  },
  fileFilter: fileFilter
});

module.exports = { uploadAvatar };