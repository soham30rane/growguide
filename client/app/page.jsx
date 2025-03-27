"use client"

import React from 'react';
import Link from 'next/link';
import '@/styles/agro.css';
import '@/styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-decoration decoration-top-right"></div>
      
      <div className="landing-content">
        <div className="landing-text">
          <h1 className="landing-title">GrowGuide</h1>
          <h2 className="landing-subtitle">Your personal plant care companion</h2>
          
          <p className="landing-description">
            Transform your home into a thriving green sanctuary. GrowGuide helps you track care schedules, 
            monitor growth progress, and learn everything you need to know about your leafy friends.
          </p>
          
          <div className="landing-features">
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Smart watering reminders</span>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Growth tracking</span>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Plant identification</span>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Expert care tips</span>
            </div>
          </div>
          
          <div className="landing-cta">
            <Link href="/register">
              <button className="primary-button">Get Started — It's Free</button>
            </Link>
            <Link href="/login">
              <button className="secondary-button">Sign In</button>
            </Link>
          </div>
        </div>
        <div className="landing-image">
          <img src="/images/plant-hero.svg" alt="Plants growing illustration" />
        </div>
      </div>
      
      <div className="landing-footer">
        <p>© 2023 GrowGuide • Helping plants thrive, one leaf at a time</p>
      </div>
    </div>
  );
};

export default LandingPage;
