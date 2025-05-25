// frontend/src/App.js
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
import EventDetailPage from './pages/EventDetailPage';
// Presupunem că vei crea această pagină mai târziu:
// import AboutPage from './pages/AboutPage'; 

import './App.css';

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="loading-message">Se verifică autentificarea...</div>;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Componenta MainLayout actualizată
function MainLayout() {
  const { token, logoutUser, currentUser } = useAuth(); // Am adăugat currentUser pentru un posibil salut

  return (
    <div className="app-container">
      <nav className="app-nav">
        {/* Partea Stângă: Logo/Nume Aplicație */}
        <div className="nav-brand">
          <NavLink to="/" className="app-nav-brand-link">
            EvenimenteApp {/* Sau un logo <img /> */}
          </NavLink>
        </div>

        {/* Partea Centrală: Link-uri principale de navigare */}
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
            to="/despre-noi" // Link nou
            className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
          >
            Despre noi
          </NavLink>
        </div>

        {/* Partea Dreaptă: Link-uri Autentificare/Utilizator */}
        <div className="nav-links-auth">
          {token ? (
            <>
              {/* Salut opțional
              {currentUser && <span className="nav-user-greeting">Salut, {currentUser.firstName || currentUser.username}!</span>}
              */}
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => isActive ? "app-nav-link app-nav-link-active" : "app-nav-link"}
              >
                Profil {/* Am schimbat din Dashboard în Profil pentru claritate */}
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
                Login
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
          {/* Ruta pentru Despre Noi - vei crea componenta AboutPage ulterior */}
          {/* <Route path="/despre-noi" element={<AboutPage />} /> */}
          <Route path="/despre-noi" element={<div>Pagină "Despre noi" (în construcție)</div>} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/eveniment/:eventId" element={<EventDetailPage />} />
          <Route path="/auth/google/succeeded" element={<GoogleAuthCallbackPage />} />
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
          <p>&copy; {new Date().getFullYear()} Cultural Hub</p>
      </footer>
    </div>
  );
}

// Componenta App rămâne la fel, doar randează MainLayout în interiorul provider-ilor
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