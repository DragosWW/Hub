// frontend/src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import './RegisterPage.css'; // Importăm CSS-ul pentru pagină

function RegisterPage() {
  return (
    <div className="auth-page-container"> {/* Refolosim clasa sau creăm una nouă dacă e nevoie de stil diferit */}
      <RegisterForm />
    </div>
  );
}
export default RegisterPage;