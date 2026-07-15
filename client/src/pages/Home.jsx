import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
// import heroBg from '../assets/hero-bg.png';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section
        className="hero"
        style={{}}
      >
        <Navbar />

        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Now live in your city</p>
            <h1>
              Tell us where.<br />We'll handle <span className="highlight">how</span>.
            </h1>
            <p className="subtext">
              Real-time matching, transparent fares, and a driver on the way
              in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/booking" className="btn-primary hero-btn">Book a ride</Link>
              <Link to="/register" className="btn-ghost hero-btn">Drive with UCAB</Link>
            </div>
          </div>

          <div className="route-card">
            <div className="route-row">
              <span className="dot pickup"></span>
              <span className="route-label">Pickup · MG Road</span>
            </div>
            <div className="route-line"></div>
            <div className="route-row">
              <span className="dot dropoff"></span>
              <span className="route-label">Drop · Tech Park</span>
            </div>
            <div className="route-meta">
              <span>12 min</span>
              <span className="dash">·</span>
              <span>₹148</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;