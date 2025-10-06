import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBell } from 'react-icons/fa';
import { CartContext } from '../contexts/Cartcontext';
import '../styles/Layout.css';

const SiteHeader = ({ variant = 'app' }) => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('notifications') || '[]';
      const list = JSON.parse(raw);
      setNotifCount(Array.isArray(list) ? list.length : 0);
    } catch { setNotifCount(0); }
  }, []);

  const renderAppNav = () => (
    <nav className="nav-actions">
      <button className="btn btn-ghost" onClick={() => navigate('/booklist')}>Browse</button>
      <button className="btn btn-outline" onClick={() => navigate('/UserProfile')}><FaUser style={{ marginRight: 6 }} /> Profile</button>
      <button
        className="btn btn-outline"
        onClick={() => {
          try {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
          } catch {}
          navigate('/login');
        }}
      >
        Logout
      </button>
      <div className="icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
        <FaBell size={20} />
        {notifCount > 0 && <span className="badge">{notifCount}</span>}
      </div>
      <div className="icon-btn" onClick={() => navigate('/Cart')} title="Cart">
        <FaShoppingCart size={20} />
        {cart.length > 0 && <span className="badge">{cart.length}</span>}
      </div>
    </nav>
  );

  const renderHomeNav = () => (
    <nav className="nav-actions">
      <button className="btn btn-ghost" onClick={() => navigate('/register')}>Sign up</button>
      <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
    </nav>
  );

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="logo" onClick={() => navigate('/home')}>📚 K-Books</div>
        {variant === 'home' ? renderHomeNav() : renderAppNav()}
      </div>
    </header>
  );
};

export default SiteHeader;


