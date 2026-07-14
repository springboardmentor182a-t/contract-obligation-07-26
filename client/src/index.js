import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/global.css'; // <-- This line is crucial for styling
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);