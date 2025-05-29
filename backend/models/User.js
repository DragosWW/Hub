
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
    required: function() { return !this.googleId && !this.email; },
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

    validate: [
      {
        validator: function(value) {
         
          if (this.googleId && !this.isModified('password')) {
            
            return true;
          }
         
          if (!this.googleId && (this.isNew || this.isModified('password'))) {
            const isValid = !(value === undefined || value === null || value === "");
            
            return isValid;
          }
          
          return true;
        },
        message: 'Parola este obligatorie pentru înregistrarea/modificarea tradițională.'
      },
      {
        validator: function(value) {
          
          if (this.googleId && !this.isModified('password')) {
            
            return true;
          }
          
          if (!this.googleId && (this.isNew || this.isModified('password'))) {
            if (value) { 
              const isValid = value.length >= 6;
              
              return isValid;
            }
            return true;
          }
          
          if (this.googleId && this.isModified('password')) {
             if (value) {
                const isValid = value.length >= 6;
                
                return isValid;
             }
             return false; 
          }
          
          return true; 
        },
        message: props => `Parola furnizată este prea scurtă! Minim 6 caractere.`
      }
    ]
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  avatar: { type: String },
  savedEvents: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


UserSchema.pre('save', async function (next) {
 
  if (this.isModified('password') && this.password) {
   
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
  } else {
   
    return next();
  }
});

UserSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) { 
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);