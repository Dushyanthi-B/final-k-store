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
        <section className="home-hero container animate-hero">
          <div className="hero-content">
            <h1 className="animate-title">Stories that stay. Knowledge that grows.</h1>
            <p className="animate-subtitle">Discover bestsellers, timeless classics, and your next great read curated for you.</p>
            <div className="hero-cta animate-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Browse books</button>
              <button className="btn btn-outline" onClick={() => navigate('/register')}>Create account</button>
            </div>
          </div>
          <div className="hero-art animate-image" aria-hidden>
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" alt="Bookshelf" />
          </div>
        </section>

        <section className="services-section container">
          <h2 className="section-title animate-fade-in">Why shop with K‑Books?</h2>
          <div className="services-grid">
            <article className="service-card fx-tilt fx-shine animate-card-appear">
              <div className="service-icon">⚡</div>
              <h3>Lightning‑fast delivery</h3>
              <p>Your favorite titles shipped quickly and safely to your doorstep.</p>
            </article>
            <article className="service-card fx-tilt fx-shine animate-card-appear-delay">
              <div className="service-icon">🧠</div>
              <h3>Curated for you</h3>
              <p>Smart recommendations based on your reading history and interests.</p>
            </article>
            <article className="service-card fx-tilt fx-shine animate-card-appear-delay-2">
              <div className="service-icon">🔒</div>
              <h3>Secure checkout</h3>
              <p>Encrypted, trusted payments so you can shop with confidence.</p>
            </article>
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

        <section className="categories-section container">
          <h2 className="section-title animate-fade-in">Browse by category</h2>
          <div className="categories-grid">
            <div className="category-pill animate-pill-hover">Fiction &amp; Literature</div>
            <div className="category-pill animate-pill-hover">Self‑help &amp; Productivity</div>
            <div className="category-pill animate-pill-hover">Business &amp; Finance</div>
            <div className="category-pill animate-pill-hover">Science &amp; Technology</div>
            <div className="category-pill animate-pill-hover">Kids &amp; Young Adult</div>
            <div className="category-pill animate-pill-hover">Classics</div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat-card">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy readers</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Books in stock</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Average rating</span>
            </div>
          </div>
        </section>

        <section className="testimonials-section container">
          <h2 className="section-title animate-fade-in">Readers love K‑Books</h2>
          <div className="testimonials-grid">
            <article className="testimonial-card animate-testimonial">
              <p className="quote">
                “I always find something new to read. The recommendations feel tailored to me.”
              </p>
              <p className="author">— Amina, student</p>
            </article>
            <article className="testimonial-card animate-testimonial">
              <p className="quote">
                “Checkout is smooth and delivery is fast. My go‑to online bookstore.”
              </p>
              <p className="author">— Rahul, entrepreneur</p>
            </article>
          </div>
        </section>

        <section className="newsletter-section">
          <div className="container newsletter-inner">
            <div>
              <h2>Stay in the chapter loop</h2>
              <p>Get early access to deals, new arrivals, and reading tips in your inbox.</p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Subscribed to K‑Books newsletter!');
              }}
            >
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Home;
