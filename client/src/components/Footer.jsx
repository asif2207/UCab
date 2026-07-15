import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            UCAB<span className="logo-dot">.</span>
          </Link>
          <p className="footer-tagline">
            Reliable rides, on your terms.
          </p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Ride with us</h4>
            <Link to="/register">Get started</Link>
            <Link to="/login">Log in</Link>
            <Link to="/history">My rides</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/terms">Terms of service</Link>
            <Link to="/privacy">Privacy policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} UCAB. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;