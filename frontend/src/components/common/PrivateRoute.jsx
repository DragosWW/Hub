
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isLoading, currentUser } = useAuth();
  console.log('PrivateRoute Check: isLoading=', isLoading, '| token=', token ? token.substring(0,10)+"..." : null, '| currentUser=', currentUser ? currentUser.email : null);

  if (isLoading) {
    console.log('PrivateRoute: Afișare "Se încarcă..."');
    return <div>Se încarcă autentificarea...</div>;
  }

  if (!token) {
    console.log('PrivateRoute: Nu există token, redirectare la /login');
    return <Navigate to="/login" replace />;
  }
  console.log('PrivateRoute: Acces permis la children.');
  return children;
};

export default PrivateRoute;