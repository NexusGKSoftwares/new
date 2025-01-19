import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the router

// Import global styles
import './styles/browser-specific/chrome.css';
import './styles/browser-specific/safari.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Render the router */}
  </React.StrictMode>
);
