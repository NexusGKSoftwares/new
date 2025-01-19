import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter'; // Import the router

// Import global styles
import './styles/browser-specific/chrome.css';
import './styles/browser-specific/safari.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter /> {/* Render the router */}
  </React.StrictMode>
);
