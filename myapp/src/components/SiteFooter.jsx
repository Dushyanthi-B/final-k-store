import React from 'react';
import '../styles/Layout.css';

const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-column brand">
          <h3>K‑Books</h3>
          <p>Stories, knowledge, and inspiration delivered to you.</p>
          <p className="footer-copy">© {new Date().getFullYear()} K‑Books. All rights reserved.</p>
        </div>

        <div className="footer-column contact">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:support@kbooks.com">support@kbooks.com</a></p>
          <p>Phone: <a href="tel:+94111234567">+94 11 123 4567</a></p>
        </div>

        <div className="footer-column location">
          <h4>Visit us</h4>
          <p>Colombo, Sri Lanka</p>
          <p>Open: Mon – Sat, 9:00 – 18:00</p>
        </div>

        <div className="footer-column services">
          <h4>Services</h4>
          <ul>
            <li>Home delivery</li>
            <li>Click &amp; collect</li>
            <li>Member discounts</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
