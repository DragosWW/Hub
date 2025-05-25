// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Aici sunt definite setCurrentUser și setToken de către useState
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      setCurrentUser(user); // Folosește setter-ul intern
      setToken(user.token);   // Folosește setter-ul intern
    }
    setIsLoading(false);
  }, []); // Nu mai e nevoie de setCurrentUser, setToken în array-ul de dependențe aici, deoarece sunt stabile

  const loginUser = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setCurrentUser(userData); // Folosește setter-ul intern
      setToken(userData.token);   // Folosește setter-ul intern
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin);
      return userData;
    } catch (error) {
      console.error("Login failed in context:", error);
      throw error;
    }
  };

  const registerUser = async (username, email, password, firstName, lastName) => {
    try {
      const userData = await authService.register(username, email, password, firstName, lastName);
      alert(userData.message || "Înregistrare reușită! Te rugăm să te loghezi.");
      navigate('/login');
      return userData;
    } catch (error) {
      console.error("Registration failed in context:", error);
      throw error;
    }
  };

  const logoutUser = () => {
    authService.logout();
    setCurrentUser(null); // Folosește setter-ul intern
    setToken(null);   // Folosește setter-ul intern
    navigate('/login');
  };

  // ACESTA ESTE OBIECTUL VALUE CARE TREBUIE SĂ CONȚINĂ SETTER-ELE
  const value = {
    currentUser,
    token,
    isLoading,
    loginUser,
    registerUser,
    logoutUser,
    setCurrentUser, // <-- ADAUGĂ ACEASTA
    setToken        // <-- ADAUGĂ ACEASTA
   };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};