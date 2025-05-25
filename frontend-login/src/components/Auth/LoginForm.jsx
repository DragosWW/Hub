import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './LoginForm.css'; // Importă fișierul CSS

// Sub-component pentru butonul Google Login
function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.REACT_APP_API_URL}/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="google-login-button" // Aplică clasa CSS
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google logo"
      />
      Continuă cu Google
    </button>
  );
}

// Componenta principală LoginForm
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      if (Array.isArray(err)) {
        setError(err.map(e => e.msg).join(', '));
      } else if (err && err.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('A apărut o eroare necunoscută la logare.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container"> {/* Aplică clasa CSS */}
      <h2 className="login-form-title">Autentificare</h2>
      
      {error && (
        <p className="login-form-error">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Adresă de Email:</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemplu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Parolă:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Parola ta"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-button" // Aplică clasa CSS
        >
          {loading ? 'Se procesează...' : 'Logare'}
        </button>
      </form>

      <GoogleLoginButton />

      <p className="register-link-text"> {/* Aplică clasa CSS */}
        Nu ai încă un cont? <Link to="/register">Înregistrează-te</Link>
      </p>
    </div>
  );
}

export default LoginForm;