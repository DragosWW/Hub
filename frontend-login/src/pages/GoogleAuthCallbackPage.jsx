// frontend/src/pages/GoogleAuthCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './GoogleAuthCallbackPage.css'; // Importă fișierul CSS

function GoogleAuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser, setToken } = useAuth(); 
  const [message, setMessage] = useState('Se procesează autentificarea Google...');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    // ... (logica useEffect rămâne la fel, cu console.log-urile de depanare pe care le-am adăugat anterior) ...
    console.log('GoogleAuthCallbackPage: Componenta s-a montat și useEffect rulează.');
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    const errorFromUrl = params.get('error');

    console.log('GoogleAuthCallbackPage: Token din URL:', tokenFromUrl);
    console.log('GoogleAuthCallbackPage: Eroare din URL (dacă există):', errorFromUrl);

    if (errorFromUrl) {
      console.error('GoogleAuthCallbackPage: Eroare primită de la Google Auth:', errorFromUrl);
      setMessage(`Eroare la autentificarea Google: ${errorFromUrl}. Vei fi redirectat la pagina de login.`);
      setErrorDetails(`Cod eroare: ${errorFromUrl}`);
      setTimeout(() => navigate('/login'), 5000);
      return;
    }

    if (tokenFromUrl) {
      const processToken = async (token) => {
        try {
          console.log('GoogleAuthCallbackPage - processToken: Început procesare token:', token ? token.substring(0,30) + "..." : "TOKEN GOL/INVALID");
          if (typeof setCurrentUser !== 'function' || typeof setToken !== 'function') {
              console.error("GoogleAuthCallbackPage - CRITICAL: setCurrentUser sau setToken nu este o funcție în AuthContext!");
              throw new Error("Contextul de autentificare nu este configurat corect pentru actualizare (setCurrentUser/setToken lipsesc).");
          }
          console.log('GoogleAuthCallbackPage - processToken: Se apelează authService.fetchMe...');
          const userData = await authService.fetchMe(token);
          console.log('GoogleAuthCallbackPage - processToken: Date utilizator primite de la fetchMe:', userData);
          if (!userData || !userData._id) {
            console.error("GoogleAuthCallbackPage - processToken: Datele utilizatorului primite de la /me sunt invalide sau goale.");
            throw new Error("Nu s-au putut prelua corect detaliile utilizatorului.");
          }
          const fullUserData = { ...userData, token: token };
          console.log('GoogleAuthCallbackPage - processToken: Obiect utilizator complet pregătit:', fullUserData);
          localStorage.setItem('user', JSON.stringify(fullUserData));
          console.log('GoogleAuthCallbackPage - processToken: Date salvate în localStorage.');
          console.log('GoogleAuthCallbackPage - processToken: Se apelează setCurrentUser și setToken din AuthContext...');
          setCurrentUser(fullUserData);
          setToken(token); 
          console.log('GoogleAuthCallbackPage - processToken: AuthContext ar trebui să fie actualizat.');
          setMessage('Autentificare Google reușită! Vei fi redirectat către dashboard...');
          console.log('GoogleAuthCallbackPage - processToken: Se navighează către /dashboard...');
          navigate('/dashboard');
        } catch (e) {
          console.error("GoogleAuthCallbackPage - processToken: Eroare în timpul procesării token-ului:", e);
          let errorMessage = e.message || "A apărut o eroare necunoscută.";
          if (e.response && e.response.data) { 
            errorMessage = JSON.stringify(e.response.data);
          } else if (Array.isArray(e) && e.length > 0 && e[0].msg) { 
            errorMessage = e.map(err => err.msg).join('; ');
          }
          setErrorDetails(errorMessage);
          setMessage(`Eroare la finalizarea autentificării. Vei fi redirectat la login.`);
          authService.logout();
          setTimeout(() => navigate('/login'), 5000);
        }
      };
      processToken(tokenFromUrl);
    } else {
      console.warn('GoogleAuthCallbackPage: Token invalid sau lipsă din URL.');
      setMessage('Token invalid sau lipsă în URL. Vei fi redirectat la login.');
      setTimeout(() => navigate('/login'), 5000);
    }
  }, [location, navigate, setCurrentUser, setToken]);

  return (
    <div className="google-callback-container">
      <h2 className="google-callback-title">Procesare Autentificare Google</h2>
      <p className="google-callback-message">{message}</p>
      {errorDetails && (
        <pre className="google-callback-error-details">
          Detalii eroare: {errorDetails}
        </pre>
      )}
      {!errorDetails && message.includes("Se procesează") && (
         <div className="google-callback-loading"><em>Te rugăm așteaptă...</em></div>
      )}
    </div>
  );
}

export default GoogleAuthCallbackPage;