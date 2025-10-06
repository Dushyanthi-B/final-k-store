// Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <SiteHeader variant="home" />

      <main className="home-body">
        <section className="home-hero container">
          <div className="hero-content">
            <h1>Stories that stay. Knowledge that grows.</h1>
            <p>Discover bestsellers, timeless classics, and your next great read curated for you.</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('/booklist')}>Browse books</button>
              <button className="btn btn-outline" onClick={() => navigate('/register')}>Create account</button>
            </div>
          </div>
          <div className="hero-art" aria-hidden>
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" alt="Bookshelf" />
          </div>
        </section>

        <section className="features container">
          <div className="feature">
            <div className="icon">🧠</div>
            <h3>Smart picks</h3>
            <p>Personalized recommendations based on what you love.</p>
          </div>
          <div className="feature">
            <div className="icon">⚡</div>
            <h3>Fast checkout</h3>
            <p>Seamless cart and secure payments, every time.</p>
          </div>
          <div className="feature">
            <div className="icon">🌍</div>
            <h3>Wide selection</h3>
            <p>From global bestsellers to indie gems across genres.</p>
          </div>
        </section>

        <section className="book-collection container">
          <h2 className="section-title">Trending now</h2>
          <div className="book-grid">
            <div className="book-card">
              <img src="https://covers.openlibrary.org/b/id/9876543-L.jpg" alt="The Silent Patient" />
              <h3>The Silent Patient</h3>
              <p>Alex Michaelides</p>
            </div>
            <div className="book-card">
              <img src="https://covers.openlibrary.org/b/id/9988776-L.jpg" alt="Atomic Habits" />
              <h3>Atomic Habits</h3>
              <p>James Clear</p>
            </div>
            <div className="book-card">
              <img src="https://covers.openlibrary.org/b/id/1234567-L.jpg" alt="1984" />
              <h3>1984</h3>
              <p>George Orwell</p>
            </div>
            <div className="book-card">
              <img src="https://covers.openlibrary.org/b/id/240727-L.jpg" alt="The Alchemist" />
              <h3>The Alchemist</h3>
              <p>Paulo Coelho</p>
            </div>
          </div>
        </section>

        <section className="cta-band container">
          <div className="cta-text">
            <h2>Join thousands of readers</h2>
            <p>Create your account to track favorites and get curated picks.</p>
          </div>
          <button className="btn primary" onClick={() => navigate('/register')}>Get started</button>
        </section>

        <section className="bookstore-info container">
          <h2>About us</h2>
          <p>
            We’re on a mission to connect people with books they can’t put down. Enjoy a smooth
            experience with trusted reviews, helpful search, and friendly support.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Home;
