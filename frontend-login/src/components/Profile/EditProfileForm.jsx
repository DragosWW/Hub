import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './EditProfileForm.css'; // Importă fișierul CSS dedicat

// Sub-componentă pentru formularul de schimbare a parolei
function ChangePasswordForm() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Log-uri pentru depanarea nepotrivirii parolelor
    console.log('--- ChangePasswordForm: Verificare Parole ---');
    console.log('Parola Nouă (din stare):', `"${passwordData.newPassword}"`);
    console.log('Confirmare Parolă (din stare):', `"${passwordData.confirmNewPassword}"`);
    const arePasswordsMatching = passwordData.newPassword === passwordData.confirmNewPassword;
    console.log('Sunt strict egale (===)?', arePasswordsMatching);
    console.log('Lungime Parola Nouă:', passwordData.newPassword.length);
    console.log('Lungime Confirmare Parolă:', passwordData.confirmNewPassword.length);
    console.log('--- Sfârșit Verificare Parole ---');

    if (!arePasswordsMatching) {
      setPasswordError('Parolele noi nu se potrivesc.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Noua parolă trebuie să aibă minim 6 caractere.');
      return;
    }

    setLoadingPassword(true);
    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(response.message || 'Parola a fost schimbată cu succes!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Resetează câmpurile
    } catch (err) {
      const errorMessages = Array.isArray(err) ? err.map(er => er.msg).join(', ') : (err.message || 'A apărut o eroare la schimbarea parolei.');
      setPasswordError(errorMessages);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="change-password-form">
      <h3 className="change-password-title">Schimbă Parola</h3>
      {passwordError && <p className="feedback-message error-message">{passwordError}</p>}
      {passwordSuccess && <p className="feedback-message success-message">{passwordSuccess}</p>}
      <form onSubmit={handlePasswordSubmit}>
        <div className="form-section">
          <label htmlFor="currentPassword">Parola Curentă:</label>
          <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
        </div>
        <div className="form-section">
          <label htmlFor="newPassword">Parola Nouă:</label>
          <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
        </div>
        <div className="form-section">
          <label htmlFor="confirmNewPassword">Confirmă Parola Nouă:</label>
          <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" disabled={loadingPassword} className="form-button change-password-button">
          {loadingPassword ? 'Se procesează...' : 'Schimbă Parola'}
        </button>
      </form>
    </div>
  );
}


// Componenta EditProfileForm principală
function EditProfileForm({ onFinishedEditing }) {
  const { currentUser, setCurrentUser, token } = useAuth(); 
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  // Funcție pentru a genera un placeholder SVG
  const generatePlaceholderSvg = (initialLetterParam) => {
    const letter = initialLetterParam ? initialLetterParam.charAt(0).toUpperCase() : 'U';
    return `data:image/svg+xml;charset=UTF-8,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23007bff'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='50px' fill='%23FFFFFF'%3E${letter}%3C/text%3E%3C/svg%3E`;
  };
  
  // Inițializează placeholderAvatar cu o valoare generică, va fi actualizat în useEffect
  const [placeholderAvatar, setPlaceholderAvatar] = useState(generatePlaceholderSvg('U'));

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        username: currentUser.username || '',
      });
      // Setează preview-ul la avatarul curent (care ar trebui să fie URL complet de la backend)
      // sau lasă-l gol pentru a se folosi placeholderAvatarSvg
      setPreviewSource(currentUser.avatar || ''); 
      
      const initial = currentUser.username || currentUser.email || 'U';
      setPlaceholderAvatar(generatePlaceholderSvg(initial));
    }
  }, [currentUser]); // Rulează când currentUser se schimbă

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file); // Generează un Data URL pentru preview local
      reader.onloadend = () => {
        setPreviewSource(reader.result); 
      };
    } else {
      setSelectedFile(null);
      // Revine la avatarul din currentUser (care ar trebui să fie URL complet) sau la string gol
      setPreviewSource(currentUser.avatar || ''); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      let finalUpdatedUser = { ...currentUser }; // Pornește cu datele curente din context (inclusiv token-ul)
      let somethingChanged = false;

      const profileDataToUpdate = {};
      if (formData.firstName !== (currentUser.firstName || '')) {
        profileDataToUpdate.firstName = formData.firstName;
        somethingChanged = true;
      }
      if (formData.lastName !== (currentUser.lastName || '')) {
        profileDataToUpdate.lastName = formData.lastName;
        somethingChanged = true;
      }
      if (formData.username !== (currentUser.username || '')) {
        profileDataToUpdate.username = formData.username;
        somethingChanged = true;
      }

      if (Object.keys(profileDataToUpdate).length > 0) {
        console.log('EditProfileForm (handleSubmit): Se actualizează datele de profil text:', profileDataToUpdate);
        const textUpdateResult = await authService.updateUserProfile(profileDataToUpdate);
        // textUpdateResult ar trebui să fie obiectul user actualizat de la backend (fără token neapărat)
        finalUpdatedUser = { ...finalUpdatedUser, ...textUpdateResult }; 
        console.log('EditProfileForm (handleSubmit): Profil text actualizat, finalUpdatedUser este acum:', finalUpdatedUser);
      }

      if (selectedFile) {
        somethingChanged = true;
        console.log('EditProfileForm (handleSubmit): Se încarcă noul avatar...');
        const avatarUpdateResult = await authService.uploadAvatar(selectedFile);
        // Log pentru a vedea exact ce returnează backend-ul
        console.log('EditProfileForm (handleSubmit): Rezultat de la authService.uploadAvatar:', avatarUpdateResult);
        
        if (avatarUpdateResult && avatarUpdateResult.user && avatarUpdateResult.user.avatar) {
          // Cel mai bun caz: backend-ul returnează obiectul user complet actualizat
          finalUpdatedUser = { ...finalUpdatedUser, ...avatarUpdateResult.user };
        } else if (avatarUpdateResult && avatarUpdateResult.avatarUrl) {
          // Fallback: backend-ul returnează doar noul avatarUrl
          finalUpdatedUser.avatar = avatarUpdateResult.avatarUrl;
        } else {
          console.error('EditProfileForm (handleSubmit): Răspunsul de la uploadAvatar nu conține URL-ul avatarului în formatul așteptat.', avatarUpdateResult);
          // Poți alege să arunci o eroare aici sau să continui fără a actualiza avatarul în context
        }
        console.log('EditProfileForm (handleSubmit): Avatar încărcat, finalUpdatedUser este acum:', finalUpdatedUser);
      }
      
      if (somethingChanged) { 
          console.log('EditProfileForm (handleSubmit): Actualizare context și localStorage cu:', finalUpdatedUser);
          // Asigură-te că token-ul este păstrat/reatașat corect.
          // Obiectul `currentUser` din context conține deja token-ul. `finalUpdatedUser` este construit pornind de la el.
          // Dacă `textUpdateResult` sau `avatarUpdateResult.user` nu conțin token, token-ul original din `currentUser` va fi păstrat.
          const userToStoreInContext = { ...finalUpdatedUser, token: token || finalUpdatedUser.token };


          setCurrentUser(userToStoreInContext); 
          localStorage.setItem('user', JSON.stringify(userToStoreInContext));
          setSuccessMessage('Profil actualizat cu succes!');
          // Actualizează preview-ul cu noul avatar din starea actualizată (URL complet)
          setPreviewSource(userToStoreInContext.avatar || ''); 
          console.log('EditProfileForm (handleSubmit): PreviewSource actualizat la:', userToStoreInContext.avatar || '');
      } else {
          setSuccessMessage('Nu au fost detectate modificări de salvat.');
      }
      setSelectedFile(null); // Resetează fișierul selectat după submit
      
    } catch (err) {
      const errorMessages = Array.isArray(err) ? err.map(er => er.msg || JSON.stringify(er)).join(', ') : (err.message || 'A apărut o eroare la actualizarea profilului.');
      setError(errorMessages);
      console.error('EditProfileForm (handleSubmit) - Eroare prinsă:', err);
    } finally {
        setLoading(false);
    }
  };

  if (!currentUser) return null; // Nu randa nimic dacă nu există currentUser (ex: la încărcarea inițială)

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Editează Profilul</h2>
      {error && <p className="feedback-message error-message">{error}</p>}
      {successMessage && <p className="feedback-message success-message">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          {/* Log pentru a vedea ce sursă este folosită efectiv pentru imagine */}
          {console.log('EditProfileForm (render): src pentru avatar-preview:', previewSource || placeholderAvatar)}
          <img 
            src={previewSource || placeholderAvatar} // Folosește previewSource (Data URL local sau URL complet de la server) sau placeholderAvatar SVG
            alt="Preview avatar" 
            className="avatar-preview"
            onError={(e) => { 
              console.warn("EditProfileForm: Eroare la încărcarea sursei pentru tag-ul <img> (src=" + e.target.src + "), se folosește placeholder-ul SVG generat.");
              e.target.src = placeholderAvatar; // Fallback la SVG-ul generat local
            }}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} ref={fileInputRef} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="avatar-change-button">
            Schimbă Avatarul
          </button>
        </div>

        <div className="form-section">
          <label htmlFor="firstName">Prenume:</label>
          <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="form-section">
          <label htmlFor="lastName">Nume de familie:</label>
          <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="form-section">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading} className="form-button save-button">
            {loading ? 'Se salvează...' : 'Salvează Modificările de Profil'}
          </button>
          <button type="button" onClick={onFinishedEditing} disabled={loading} className="form-button cancel-button">
            Înapoi la Profil
          </button>
        </div>
      </form>
 
      <ChangePasswordForm /> {/* Formularul pentru schimbarea parolei */}
    </div>
  );
}

export default EditProfileForm;