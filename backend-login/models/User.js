// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  username: {
    type: String,
    required: function() { return !this.googleId && !this.email; }, // Ajustează după cum consideri necesar
    unique: true,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Te rugăm să introduci o adresă de email validă.'],
  },
  password: {
    type: String,
    // Folosim un array de validatori custom pentru control mai fin
    validate: [
      {
        validator: function(value) {
          // Dacă este un utilizator Google ȘI parola nu este modificată în această operațiune, validarea trece.
          // Acest lucru permite salvarea altor câmpuri pentru un utilizator Google fără a necesita parolă.
          if (this.googleId && !this.isModified('password')) {
            // console.log(`Password Validator 1: Google user, password not modified. Passing. Value: '${value}'`);
            return true;
          }
          // Dacă NU este un utilizator Google ȘI (este un document nou SAU parola este modificată explicit)
          // atunci parola trebuie să aibă o valoare (să nu fie goală/undefined).
          if (!this.googleId && (this.isNew || this.isModified('password'))) {
            const isValid = !(value === undefined || value === null || value === "");
            // console.log(`Password Validator 1: Traditional user, new/modified. Required check. Value: '${value}', IsValid: ${isValid}`);
            return isValid;
          }
          // În toate celelalte cazuri (ex: user Google care își setează/modifică parola,
          // sau user tradițional la care nu se modifică parola), validarea de "required" trece aici,
          // iar minlength se va ocupa de lungime dacă e cazul.
          // console.log(`Password Validator 1: Default pass. Value: '${value}'`);
          return true;
        },
        message: 'Parola este obligatorie pentru înregistrarea/modificarea tradițională.'
      },
      {
        validator: function(value) {
          // Dacă este un utilizator Google ȘI parola nu este modificată, validarea de lungime trece.
          if (this.googleId && !this.isModified('password')) {
            // console.log(`Password Validator 2 (minlength): Google user, password not modified. Passing. Value: '${value}'`);
            return true;
          }
          // Dacă este un utilizator tradițional ȘI (este nou SAU parola este modificată),
          // ȘI o valoare pentru parolă este furnizată, atunci verifică lungimea.
          if (!this.googleId && (this.isNew || this.isModified('password'))) {
            if (value) { // Verifică lungimea doar dacă există o valoare
              const isValid = value.length >= 6;
              // console.log(`Password Validator 2 (minlength): Traditional user, new/modified. Length check. Value: '${value}', Length: ${value.length}, IsValid: ${isValid}`);
              return isValid;
            }
            return true; // Dacă e gol și a trecut de "required" de mai sus, e OK (deși required ar trebui să-l prindă)
          }
          // Dacă este un utilizator Google care își *setează* parola (this.googleId este true, this.isModified('password') este true)
          if (this.googleId && this.isModified('password')) {
             if (value) {
                const isValid = value.length >= 6;
                // console.log(`Password Validator 2 (minlength): Google user SETTING password. Length check. Value: '${value}', Length: ${value.length}, IsValid: ${isValid}`);
                return isValid;
             }
             return false; // Trebuie să furnizeze o parolă dacă o modifică
          }
          // console.log(`Password Validator 2 (minlength): Default pass. Value: '${value}'`);
          return true; // În alte cazuri (ex: user tradițional existent la care nu se modifică parola), validarea trece.
        },
        message: props => `Parola furnizată este prea scurtă! Minim 6 caractere.`
      }
    ]
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  avatar: { type: String },
  savedEvents: { type: [String], default: [] }, // Asigură-te că este aici
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware Mongoose pentru a hasha parola înainte de salvare
UserSchema.pre('save', async function (next) {
  // Hashează parola doar dacă a fost modificată ȘI este prezentă (nu e goală/null)
  if (this.isModified('password') && this.password) {
    // console.log(`UserSchema Pre-save Hook: Se hashează parola pentru ${this.email}.`);
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
  } else {
    // console.log(`UserSchema Pre-save Hook: Se sare peste hasharea parolei pentru ${this.email}. IsModified: ${this.isModified('password')}, Password Val: '${this.password}'`);
    return next();
  }
});

// Middleware Mongoose pentru a actualiza 'updatedAt' la fiecare salvare dacă există modificări
UserSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Metodă pentru a compara parola introdusă cu cea hashată din BD
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) { // Dacă nu există parolă stocată (ex: cont Google fără parolă setată local)
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);