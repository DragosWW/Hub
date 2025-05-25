// frontend/src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Adaugă useNavigate
import './RegisterForm.css'; // Importă fișierul CSS

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Adaugă câmp pentru confirmarea parolei
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerUser } = useAuth(); // Presupunând că registerUser e în AuthContext
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Parolele nu se potrivesc.');
      return;
    }
    // Poți adăuga și alte validări client-side aici

    setLoading(true);
    try {
      // Trimite doar câmpurile necesare pentru registerUser din AuthContext/authService
      await registerUser(
        formData.username,
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      // registerUser din AuthContext ar trebui să gestioneze redirectarea sau mesajul de succes
      // De ex., AuthContext ar putea naviga la /login și afișa un mesaj "Înregistrare reușită, te rugăm să te loghezi"
    } catch (err) {
      if (Array.isArray(err)) {
        setError(err.map(e => e.msg).join(', '));
      } else if (err && err.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('A apărut o eroare necunoscută la înregistrare.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-form-title">Înregistrare Cont Nou</h2>
      {error && <p className="register-form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Parolă (min. 6 caractere):</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required minLength="6" />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmă Parola:</label>
          <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">Prenume (opțional):</label>
          <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nume (opțional):</label>
          <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading} className="submit-button-register">
          {loading ? 'Se procesează...' : 'Creează Cont'}
        </button>
      </form>
      <p className="login-link-text">
        Ai deja un cont? <Link to="/login">Autentifică-te</Link>
      </p>
    </div>
  );
}

export default RegisterForm;