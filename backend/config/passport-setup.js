
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');


        passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          
          return done(null, user);
        } else {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            
            user.googleId = profile.id;
            user.avatar = (profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.avatar) || null; 
            if (!user.username && profile.displayName) {
                user.username = profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
            }
            
            await user.save();
            console.log(`INFO: Contul Google a fost linkat la utilizatorul existent: ${user.email}`); 
            return done(null, user);
          } else {
            
            const newUser = new User({
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
              email: profile.emails[0].value,
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              avatar: (profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null),
              
            });
            await newUser.save();
            console.log(`INFO: Utilizator nou creat prin Google: ${newUser.email}`); 
            return done(null, newUser);
          }
        }
      } catch (err) {
        console.error("Eroare în callback-ul Google Strategy:", err.message, "\nStack:", err.stack); 
        return done(err, null);
      }
    }
  )
);
