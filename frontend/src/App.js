
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';

import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GoogleAuthCallbackPage from './pages/GoogleAuthCallbackPage';
import AboutUsPage from './pages/AboutUsPage'; 
import EventDetailPage from './pages/EventDetailPage'; 
import './App.css';


const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="loading-message">Se verifică autentificarea...</div>;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};


function MainLayout() {
  const { token, logoutUser } = useAuth();

  return (
    <div className="app-container">
      <nav className="app-nav">
        
        <div className="nav-brand">
          <NavLink to="/" className="app-nav-brand-link">
            
            <img 
              src="/images/Cultural Hub.png" 
              alt="Cultural Hub Brașov Logo" 
              className="nav-logo-image" 
            />
          </NavLink>
        </div>

        
        <div className="nav-links-main">
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
          >
            Acasă
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/despre-noi"
            className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
          >
            Despre noi
          </NavLink>
        </div>

        
        <div className="nav-links-auth">
          {token ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
              >
                Profil
              </NavLink>
              <button onClick={logoutUser} className="app-nav-link logout-button-styled">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
              >
                Logare
              </NavLink>
              <NavLink 
                to="/register" 
                className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
              >
                Înregistrare
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/despre-noi" element={<AboutUsPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/succeeded" element={<GoogleAuthCallbackPage />} />
           <Route path="/eveniment/:eventId" element={<EventDetailPage />} /> 
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Cultural Hub Brașov. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <MainLayout />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;