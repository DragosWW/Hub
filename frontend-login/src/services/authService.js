import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error("EROARE CRITICĂ: REACT_APP_API_URL nu este definit în fișierul .env al frontend-ului!");
}

const register = async (username, email, password, firstName, lastName) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username, email, password, firstName, lastName,
    });
    return response.data;
  } catch (error) {
    console.error("Eroare în serviciul de înregistrare:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors ||
                          (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'A apărut o eroare la înregistrare.' }];
    throw errorsToThrow;
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Eroare în serviciul de logare:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors ||
                          (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'A apărut o eroare la logare.' }];
    throw errorsToThrow;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try { return JSON.parse(userStr); } catch (e) {
      console.error("Eroare la parsarea datelor utilizatorului din localStorage:", e);
      localStorage.removeItem('user'); return null;
    }
  }
  return null;
};

const getToken = () => {
  const user = getCurrentUser();
  return user ? user.token : null;
};

const fetchMe = async (token) => {
  if (!token) throw [{ msg: 'Token-ul lipsește pentru fetchMe.' }];
  if (!API_URL) throw [{ msg: 'URL-ul API-ului nu este configurat pentru fetchMe.' }];
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("authService.fetchMe - Eroare detaliată:", error.response?.data || error.message || error);
    const errorData = error.response?.data;
    const errorsToThrow = errorData?.errors || (errorData?.msg ? [{ msg: errorData.msg }] : null) ||
                          [{ msg: error.message || 'Eroare la preluarea datelor utilizatorului.' }];
    throw errorsToThrow;
  }
};

const getUserSavedEvents = async () => {
  const token = getToken();
  if (!token) return [];
  if (!API_URL) { console.error("getUserSavedEvents: API_URL nu este definit."); return []; }
  try {
    const response = await axios.get(`${API_URL}/me/saved-events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la preluarea evenimentelor salvate:", error.response?.data || error.message);
    throw error.response?.data?.errors || [{ msg: 'Nu s-au putut încărca evenimentele salvate.' }];
  }
};

const addEventToUserCalendar = async (eventId) => {
  const token = getToken();
  if (!token) throw new Error("Utilizatorul nu este logat.");
  if (!API_URL) { console.error("addEventToUserCalendar: API_URL nu este definit."); throw new Error("URL-ul API-ului nu este configurat."); }
  try {
    const response = await axios.post(`${API_URL}/me/saved-events`, { eventId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Eroare la adăugarea evenimentului în authService:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors || (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'Nu s-a putut adăuga evenimentul în serviciu.' }];
    throw errorsToThrow;
  }
};

const removeEventFromUserCalendar = async (eventId) => {
  const token = getToken();
  if (!token) throw new Error("Utilizatorul nu este logat.");
  if (!API_URL) { console.error("removeEventFromUserCalendar: API_URL nu este definit."); throw new Error("URL-ul API-ului nu este configurat."); }
  try {
    const response = await axios.delete(`${API_URL}/me/saved-events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la ștergerea evenimentului:", error.response?.data || error.message);
    throw error.response?.data?.errors || [{ msg: 'Nu s-a putut șterge evenimentul.' }];
  }
};

const updateUserProfile = async (userDataToUpdate) => {
  const token = getToken();
  if (!token) throw new Error("Utilizatorul nu este logat pentru actualizare profil.");
  if (!API_URL) { console.error("updateUserProfile: API_URL nu este definit."); throw new Error("URL-ul API-ului nu este configurat."); }
  try {
    const response = await axios.put(`${API_URL}/me/profile`, userDataToUpdate, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la actualizarea profilului în authService:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors || (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'Nu s-a putut actualiza profilul.' }];
    throw errorsToThrow;
  }
};

const uploadAvatar = async (fileData) => {
  const token = getToken();
  if (!token) throw new Error("Utilizatorul nu este logat pentru upload avatar.");
  if (!API_URL) { console.error("uploadAvatar: API_URL nu este definit."); throw new Error("URL-ul API-ului nu este configurat."); }

  const formData = new FormData();
  formData.append('avatarFile', fileData);

  try {
    const response = await axios.post(`${API_URL}/me/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la încărcarea avatarului în authService:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors || (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'Nu s-a putut încărca avatarul.' }];
    throw errorsToThrow;
  }
};

const changePassword = async (passwordData) => {
  const token = getToken();
  if (!token) throw new Error("Utilizatorul nu este logat pentru schimbarea parolei.");
  if (!API_URL) { console.error("changePassword: API_URL nu este definit."); throw new Error("URL-ul API-ului nu este configurat."); }
  try {
    const response = await axios.put(`${API_URL}/me/password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la schimbarea parolei în authService:", error.response?.data || error.message);
    const errorsToThrow = error.response?.data?.errors || (error.response?.data ? [error.response.data] : []) ||
                          [{ msg: error.message || 'Nu s-a putut schimba parola.' }];
    throw errorsToThrow;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  fetchMe,
  getUserSavedEvents,
  addEventToUserCalendar,
  removeEventFromUserCalendar,
  updateUserProfile, // Este aici
  uploadAvatar,
  changePassword
};

export default authService;