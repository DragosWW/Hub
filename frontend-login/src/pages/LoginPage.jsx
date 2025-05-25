import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './LoginPage.css'; // Importăm CSS-ul pentru pagină

function LoginPage() {
  return (
    <div className="auth-page-container"> {/* Clasă pentru containerul paginii */}
      <LoginForm />
    </div>
  );
}
export default LoginPage;