
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditProfileForm from '../components/Profile/EditProfileForm';
import UserSavedEventsList from '../components/Profile/UserSavedEventsList'; 
import './DashboardPage.css';

function DashboardPage() {
  const { currentUser, logoutUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [placeholderAvatarSvg, setPlaceholderAvatarSvg] = useState('');

  const generatePlaceholderSvg = (initialLetterParam) => {
    const letter = initialLetterParam ? initialLetterParam.charAt(0).toUpperCase() : 'U';
    return `data:image/svg+xml;charset=UTF-8,%3Csvg width='130' height='130' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23007bff'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='50px' fill='%23FFFFFF'%3E${letter}%3C/text%3E%3C/svg%3E`;
  };

  useEffect(() => {
    if (currentUser) {
      const initial = currentUser.username || currentUser.email || 'U';
      setPlaceholderAvatarSvg(generatePlaceholderSvg(initial));
    } else {
      setPlaceholderAvatarSvg(generatePlaceholderSvg('U'));
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="loading-message">Se încarcă datele utilizatorului...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img 
          src={currentUser.avatar || placeholderAvatarSvg} 
          alt="Avatar utilizator" 
          className="dashboard-avatar"
          onError={(e) => { 
            console.warn("DashboardPage: Eroare la încărcarea currentUser.avatar, se folosește placeholder-ul SVG.");
            e.target.src = placeholderAvatarSvg; 
          }}
        />
        <h1 className="dashboard-title">
          {isEditing ? 'Editare Profil' : 'Profilul Meu'}
        </h1>
        {!isEditing && (
          <p className="dashboard-welcome">
            Bine ai venit, {currentUser.firstName || currentUser.username || currentUser.email}!
          </p>
        )}
      </div>

      {isEditing ? (
        <div className="edit-profile-form-wrapper">
          <EditProfileForm 
            onFinishedEditing={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <> 
          <div className="profile-details">
            <h2 className="profile-details-title">Detaliile Tale</h2>
            {currentUser.username && (
              <p className="profile-detail-item">
                <strong>Username:</strong> {currentUser.username}
              </p>
            )}
            {currentUser.email && (
              <p className="profile-detail-item">
                <strong>Email:</strong> {currentUser.email}
              </p>
            )}
            {currentUser.firstName && (
              <p className="profile-detail-item">
                <strong>Prenume:</strong> {currentUser.firstName}
              </p>
            )}
            {currentUser.lastName && (
              <p className="profile-detail-item">
                <strong>Nume de familie:</strong> {currentUser.lastName}
              </p>
            )}
            {currentUser._id && (
              <p className="user-id-text">
                <small><strong>ID Utilizator:</strong> {currentUser._id}</small>
              </p>
            )}
          </div>

       
          <div className="user-saved-events-section"> 
            <h2 className="profile-details-title">Evenimentele Tale Salvate</h2>
            <UserSavedEventsList /> 
          </div>

          <div className="dashboard-actions">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="dashboard-button edit-button"
              >
                Editează Profilul
              </button>
            )}
            <button 
              onClick={logoutUser} 
              className="dashboard-button logout-button"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;