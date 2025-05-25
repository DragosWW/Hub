const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Funcție internă pentru generarea token-ului JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('EROARE CRITICĂ în generateToken: JWT_SECRET nu este definit!');
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Controller pentru înregistrarea tradițională ---
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, firstName, lastName } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      const conflictField = user.email === email ? 'email' : 'username';
      return res.status(400).json({ errors: [{ msg: `Un utilizator cu acest ${conflictField} există deja.` }] });
    }

    user = new User({ username, email, password, firstName, lastName });
    await user.save();

    const token = generateToken(user.id);
    if (!token) {
        console.error("authController: registerUser - Eroare la generarea token-ului JWT.");
        return res.status(500).send('Eroare server la generarea token-ului de autentificare.');
    }

    const newUser = await User.findById(user.id).select('-password'); // Pentru a returna datele complete
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      savedEvents: newUser.savedEvents,
      token: token,
      message: 'Utilizator înregistrat cu succes!'
    });

  } catch (err) {
    console.error("Eroare Server (registerUser):", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare server la înregistrare');
  }
};

// --- Controller pentru logarea tradițională ---
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Credențiale invalide.' }] });
    }

    if (user.password) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(400).json({ errors: [{ msg: 'Credențiale invalide.' }] });
        }
    } else if (user.googleId) {
        return res.status(400).json({ errors: [{msg: 'Acest cont este asociat cu Google. Te rugăm să te autentifici cu Google sau să îți setezi o parolă.'}]});
    } else {
        return res.status(400).json({ errors: [{msg: 'Metodă de autentificare neclară pentru acest cont.'}]});
    }

    const token = generateToken(user.id);
    if (!token) {
        console.error("authController: loginUser - Eroare la generarea token-ului JWT.");
        return res.status(500).send('Eroare server la generarea token-ului de autentificare.');
    }
    
    // Pregătește obiectul user pentru răspuns, fără parolă
    const userToSend = {
        _id: user._id, username: user.username, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        avatar: user.avatar, savedEvents: user.savedEvents,
    };

    res.json({ ...userToSend, token: token, message: 'Logare reușită!' });

  } catch (err) {
    console.error("Eroare Server (loginUser):", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare server la logare');
  }
};

// --- Controller pentru a obține datele utilizatorului curent ---
exports.getMe = async (req, res) => {
  if (!req.user || !req.user.id) {
    console.warn('authController: getMe - Tentativă de acces neautorizat sau token invalid (req.user.id nedefinit).');
    return res.status(401).json({ msg: 'Utilizator neautorizat.'});
  }
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
        return res.status(404).json({ msg: 'Utilizator negăsit în baza de date.' });
    }
    res.json(user);
  } catch (err) {
    console.error("Eroare Server (getMe):", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare Server la preluarea datelor utilizatorului.');
  }
};

// --- Controller pentru callback-ul Google OAuth ---
exports.googleAuthCallback = (req, res) => {
  if (!req.user || !req.user.id) {
    console.error('authController: googleAuthCallback - Eroare: req.user sau req.user.id nu este definit după autentificarea Passport.');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_user_processing_error`);
  }

  const token = generateToken(req.user.id);
  if (!token) {
    console.error('authController: googleAuthCallback - Eroare la generarea token-ului JWT.');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=jwt_generation_failed`);
  }
  
  console.log(`INFO: Utilizator ${req.user.email} autentificat cu Google, redirectare către frontend.`); // Un log informativ util
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/succeeded?token=${token}`);
};

// --- Funcții pentru Gestionarea Evenimentelor Salvate ---
exports.getSavedEvents = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  try {
    const user = await User.findById(req.user.id).select('savedEvents');
    if (!user) return res.status(404).json({ msg: 'Utilizator negăsit' });
    res.json(user.savedEvents || []);
  } catch (err) {
    console.error("Eroare la authController.getSavedEvents:", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare Server');
  }
};

exports.addSavedEvent = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ msg: 'ID-ul evenimentului este necesar.' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Utilizator negăsit' });

    if (!Array.isArray(user.savedEvents)) user.savedEvents = []; // Siguranță
    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId);
      await user.save(); 
    }
    res.status(200).json(user.savedEvents);
  } catch (err) {
    console.error("Eroare la authController.addSavedEvent:", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare Server la adăugarea evenimentului.');
  }
};

exports.removeSavedEvent = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  const { eventId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Utilizator negăsit' });

    const initialLength = user.savedEvents.length;
    user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
    if (user.savedEvents.length < initialLength) {
        await user.save();
    }
    res.status(200).json(user.savedEvents);
  } catch (err) {
    console.error("Eroare la authController.removeSavedEvent:", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare Server la ștergerea evenimentului.');
  }
};

// --- Funcție pentru Actualizarea Profilului (Text) ---
exports.updateUserProfile = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, username } = req.body;
  const fieldsToUpdate = {};
  if (firstName !== undefined) fieldsToUpdate.firstName = firstName;
  if (lastName !== undefined) fieldsToUpdate.lastName = lastName;
  if (username !== undefined && username.trim() !== '' && username.trim() !== req.user.username) {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) return res.status(400).json({ errors: [{ msg: 'Username-ul trebuie să aibă cel puțin 3 caractere.', param: 'username'}] });
    const existingUserByUsername = await User.findOne({ username: trimmedUsername });
    if (existingUserByUsername && existingUserByUsername._id.toString() !== req.user.id) {
      return res.status(400).json({ errors: [{ msg: 'Acest username este deja folosit.', param: 'username' }] });
    }
    fieldsToUpdate.username = trimmedUsername;
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    const currentUserData = await User.findById(req.user.id).select('-password');
    return res.json(currentUserData);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, { $set: fieldsToUpdate }, { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    if (!user) return res.status(404).json({ msg: 'Utilizator negăsit.' });
    console.log(`INFO: Profil actualizat pentru ${user.email}.`); // Log informativ
    res.json(user);
  } catch (err) {
    console.error("Eroare la authController.updateUserProfile:", err.message, "\nStack:", err.stack);
    if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
        return res.status(400).json({ errors: [{msg: 'Valoarea specificată pentru un câmp unic (ex: username) este deja în uz.', param: err.keyValue && Object.keys(err.keyValue)[0] || 'unknown'}] });
    }
    res.status(500).send('Eroare server la actualizarea profilului.');
  }
};

// --- Funcție pentru Upload Avatar ---
exports.updateUserAvatar = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  if (!req.file) return res.status(400).json({ errors: [{ msg: 'Niciun fișier nu a fost încărcat.' }]});

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      if(req.file && req.file.path) fs.unlink(req.file.path, (errUnlink) => { if (errUnlink) console.error("Eroare ștergere avatar nefolosit (user negăsit):", errUnlink); });
      return res.status(404).json({ msg: 'Utilizator negăsit.' });
    }

    // Șterge avatarul vechi
    if (user.avatar && user.avatar.startsWith(process.env.BACKEND_URL || 'http://localhost:5000')) {
        const oldRelativePath = user.avatar.substring((process.env.BACKEND_URL || 'http://localhost:5000').length);
        if (oldRelativePath.startsWith('/uploads/avatars/')) {
            const oldAvatarPhysicalPath = path.join(__dirname, '..', 'public', oldRelativePath);
            const newRelativePathCheck = `/uploads/avatars/${req.file.filename}`;
            if (fs.existsSync(oldAvatarPhysicalPath) && oldRelativePath !== newRelativePathCheck) {
                fs.unlink(oldAvatarPhysicalPath, errUnlink => {
                    if (errUnlink) console.error('Eroare la ștergerea avatarului vechi:', errUnlink);
                    // else console.log('Avatarul vechi a fost șters:', oldAvatarPhysicalPath); // Poate fi prea verbos
                });
            }
        }
    } else if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldAvatarPhysicalPath = path.join(__dirname, '..', 'public', user.avatar);
        const newRelativePathCheck = `/uploads/avatars/${req.file.filename}`;
        if (fs.existsSync(oldAvatarPhysicalPath) && user.avatar !== newRelativePathCheck) {
            fs.unlink(oldAvatarPhysicalPath, errUnlink => {
                if (errUnlink) console.error('Eroare ștergere avatar vechi (cale relativă):', errUnlink);
            });
        }
    }
    
    const relativeAvatarPath = `/uploads/avatars/${req.file.filename}`;
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'; 
    const fullAvatarUrl = `${backendUrl}${relativeAvatarPath}`; 

    user.avatar = fullAvatarUrl;
    await user.save();
    console.log(`INFO: Avatar actualizat pentru ${user.email}. Noul URL: ${user.avatar}`); // Log informativ
    
    const userResponse = {
        _id: user._id, username: user.username, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        avatar: user.avatar, savedEvents: user.savedEvents
    };
    res.json({ msg: 'Avatar actualizat cu succes.', avatarUrl: user.avatar, user: userResponse });

  } catch (err) {
    if(req.file && req.file.path) fs.unlink(req.file.path, (unlinkErr) => { if (unlinkErr) console.error("Eroare ștergere avatar (din catch) după eroare BD:", unlinkErr); });
    console.error("Eroare la authController.updateUserAvatar:", err.message, "\nStack:", err.stack);
    res.status(500).send('Eroare server la actualizarea avatarului.');
  }
};

// --- Funcție Nouă pentru Schimbarea Parolei ---
exports.changePassword = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Utilizator neautorizat.' });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select('+password'); // Selectează explicit parola
    if (!user) return res.status(404).json({ msg: 'Utilizator negăsit.' });

    if (!user.password && user.googleId) {
        return res.status(400).json({ errors: [{ msg: 'Acest cont este autentificat prin Google și nu are o parolă locală.' }] });
    }
    if (!user.password) {
        return res.status(400).json({ errors: [{ msg: 'Nu există o parolă setată pentru acest cont.'}] });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Parola curentă este incorectă.' }] });

    user.password = newPassword;
    await user.save();
    console.log(`INFO: Parola schimbată cu succes pentru ${user.email}.`); // Log informativ
    res.json({ message: 'Parola a fost schimbată cu succes.' });
  } catch (err) {
    console.error("Eroare la authController.changePassword:", err.message, "\nStack:", err.stack);
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(e => ({ msg: e.message, param: e.path }));
        return res.status(400).json({ errors: validationErrors });
    }
    res.status(500).send('Eroare server la schimbarea parolei.');
  }
};