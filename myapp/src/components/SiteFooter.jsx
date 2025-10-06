import React from 'react';
import '../styles/Layout.css';

const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>© {new Date().getFullYear()} K-Books</div>
        <div className="links">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;




