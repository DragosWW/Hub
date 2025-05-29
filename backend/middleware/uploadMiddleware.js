
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const avatarUploadPath = path.join(__dirname, '..', 'public', 'uploads', 'avatars');


if (!fs.existsSync(avatarUploadPath)) {
  fs.mkdirSync(avatarUploadPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarUploadPath); 
  },
  filename: function (req, file, cb) {
   
    const userId = req.user ? req.user.id : 'unknownuser';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


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
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: fileFilter
});

module.exports = { uploadAvatar };