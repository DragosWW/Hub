// backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
// require('dotenv').config(); // Nu e necesar dacă e încărcat în server.js

        passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log('DEBUG: Google profile primit:', JSON.stringify(profile, null, 2)); // POATE FI ȘTERS/COMENTAT

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // console.log('DEBUG: Utilizator găsit prin Google ID:', user.email); // POATE FI ȘTERS/COMENTAT
          return done(null, user);
        } else {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // console.log('DEBUG: Email existent, se linkează Google ID pentru:', user.email); // POATE FI ȘTERS/COMENTAT
            user.googleId = profile.id;
            user.avatar = (profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.avatar) || null; // Păstrează avatarul existent dacă Google nu oferă unul
            if (!user.username && profile.displayName) {
                user.username = profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
            }
            // Asigură-te că salvezi doar dacă s-au făcut modificări relevante (deși .save() ar trebui să gestioneze asta)
            await user.save();
            console.log(`INFO: Contul Google a fost linkat la utilizatorul existent: ${user.email}`); // Log informativ util
            return done(null, user);
          } else {
            // console.log('DEBUG: Se creează un utilizator nou cu datele Google pentru email:', profile.emails[0].value); // POATE FI ȘTERS/COMENTAT
            const newUser = new User({
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
              email: profile.emails[0].value,
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              avatar: (profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null),
              // Parola nu este setată pentru utilizatorii Google la creare
            });
            await newUser.save();
            console.log(`INFO: Utilizator nou creat prin Google: ${newUser.email}`); // Log informativ util
            return done(null, newUser);
          }
        }
      } catch (err) {
        console.error("Eroare în callback-ul Google Strategy:", err.message, "\nStack:", err.stack); // PĂSTREAZĂ ACEST LOG
        return done(err, null);
      }
    }
  )
);
