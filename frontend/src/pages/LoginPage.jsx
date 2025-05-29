import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './LoginPage.css'; 

function LoginPage() {
  return (
    <div className="auth-page-container"> 
      <LoginForm />
    </div>
  );
}
export default LoginPage;