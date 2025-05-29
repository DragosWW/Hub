
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      setCurrentUser(user); 
      setToken(user.token);  
    }
    setIsLoading(false);
  }, []); 

  const loginUser = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setCurrentUser(userData); 
      setToken(userData.token);  
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
    setCurrentUser(null); 
    setToken(null);   
    navigate('/login');
  };

  
  const value = {
    currentUser,
    token,
    isLoading,
    loginUser,
    registerUser,
    logoutUser,
    setCurrentUser, 
    setToken        
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