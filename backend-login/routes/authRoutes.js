const express = require('express');
const passport = require('passport');
const {
  registerUser,
  loginUser,
  getMe,
  googleAuthCallback,
  getSavedEvents,
  addSavedEvent,
  removeSavedEvent,
  updateUserProfile,
  updateUserAvatar,
  changePassword // Adaugă funcția controller pentru schimbarea parolei
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { check, param, body } = require('express-validator');
const { uploadAvatar } = require('../middleware/uploadMiddleware'); // Middleware pentru upload avatar

const router = express.Router();

// --- Rute Tradiționale de Autentificare ---
router.post(
  '/register',
  [
    check('username', 'Numele de utilizator este obligatoriu').not().isEmpty().trim().escape(),
    check('email', 'Te rugăm să incluzi un email valid').isEmail().normalizeEmail(),
    check('password', 'Te rugăm să introduci o parolă cu minim 6 caractere').isLength({ min: 6 }),
    check('firstName').optional({ checkFalsy: true }).isString().withMessage('Prenumele trebuie să fie text.').trim().escape(),
    check('lastName').optional({ checkFalsy: true }).isString().withMessage('Numele de familie trebuie să fie text.').trim().escape(),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Te rugăm să incluzi un email valid').isEmail().normalizeEmail(),
    check('password', 'Parola este obligatorie').exists(),
  ],
  loginUser
);

router.get('/me', protect, getMe);

// --- Rute pentru Autentificarea cu Google ---
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`
  }),
  googleAuthCallback
);

// --- Rute pentru Gestionarea Evenimentelor Salvate ---
router.get('/me/saved-events', protect, getSavedEvents);

router.post(
  '/me/saved-events',
  protect,
  [ check('eventId', 'ID-ul evenimentului este necesar și nu poate fi gol.').not().isEmpty().trim().escape() ],
  addSavedEvent
);

router.delete(
  '/me/saved-events/:eventId',
  protect,
  [ param('eventId', 'ID-ul evenimentului din URL este invalid.').isString().not().isEmpty().trim().escape() ],
  removeSavedEvent
);

// --- Rute pentru Profilul Utilizatorului ---

// @route   PUT /api/auth/me/profile
// @desc    Actualizează profilul utilizatorului (nume, prenume, username)
router.put(
  '/me/profile',
  protect,
  [
    check('firstName').optional({ checkFalsy: true }).isString().withMessage('Prenumele trebuie să fie text.').trim().escape(),
    check('lastName').optional({ checkFalsy: true }).isString().withMessage('Numele de familie trebuie să fie text.').trim().escape(),
    check('username').optional({ checkFalsy: true }).isLength({min:3}).withMessage('Username-ul trebuie să aibă minim 3 caractere.').trim().escape(),
  ],
  updateUserProfile
);

// @route   POST /api/auth/me/avatar
// @desc    Încarcă/Actualizează avatarul utilizatorului
router.post(
  '/me/avatar',
  protect,
  uploadAvatar.single('avatarFile'), // 'avatarFile' este numele câmpului din FormData
  updateUserAvatar
);


router.put(
  '/me/password',
  protect,
  [
    body('currentPassword', 'Parola curentă este obligatorie.').not().isEmpty(),
    body('newPassword', 'Noua parolă este obligatorie și trebuie să aibă minim 6 caractere.').isLength({ min: 6 }),

  ],
  changePassword
);

module.exports = router;