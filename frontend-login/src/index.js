// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Sau App.css
import App from './App'; // Verifică acest import

const root = ReactDOM.createRoot(document.getElementById('root')); // Verifică ID-ul
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);