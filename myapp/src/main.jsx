// main.jsx (Vite) or index.jsx (CRA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './contexts/Cartcontext';
import './index.css';
import { UserProvider } from './contexts/Usercontext'; // Ensure correct import

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider> {/* Wrap App with UserProvider */}
      <CartProvider> {/* Wrap App with CartProvider */}
        <App />
      </CartProvider>
    </UserProvider>
  </BrowserRouter>
);
