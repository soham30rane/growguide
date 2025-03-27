"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import '@/styles/auth.css';
import '@/styles/agro.css';
import Image from 'next/image';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: '',
    phone: '',
    username: '',
    password: '',
    role: '',
    about: '',
    location: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.language) newErrors.language = 'Language is required';
    if (step === 2) {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) 
        newErrors.password = 'Password must be at least 8 characters';
    }
    if (step === 3) {
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.about) newErrors.about = 'This field is required';
    }
    if (step === 4 && !formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(step + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      console.log('Registration submitted:', formData);
      // Handle registration logic here
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <div className="auth-image">
          <Image
              src="/images/plant-illustration.webp"
              alt="Growing plant illustration"
              width={300}
              height={300}
              priority
              className="w-auto h-auto"
          />
      </div>
        <div className="auth-form">
          <h1>Join GrowGuide</h1>
          <p className="subtitle">Create an account and start your plant journey</p>
          
          <form onSubmit={step === 4 ? handleSubmit : handleNext}>
            {step === 1 && (
              <div className="form-group">
                <label>Preferred Language</label>
                <div className="language-buttons">
                  {['English', 'Hindi', 'Marathi', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi'].map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={`language-button ${formData.language === lang ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, language: lang })}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {errors.language && <p className="error-text">{errors.language}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && <p className="error-text">{errors.username}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={errors.role ? 'error' : ''}
                  >
                    <option value="">Select a role</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Expert/Consultant">Expert/Consultant</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                  {errors.role && <p className="error-text">{errors.role}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="about">Write a bit about yourself</label>
                  <textarea
                    id="about"
                    name="about"
                    placeholder="Describe your role or expertise (e.g., type of crops)"
                    value={formData.about}
                    onChange={handleChange}
                    className={errors.about ? 'error' : ''}
                  />
                  {errors.about && <p className="error-text">{errors.about}</p>}
                </div>
              </>
            )}

            {step === 4 && (
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? 'error' : ''}
                />
                {errors.location && <p className="error-text">{errors.location}</p>}
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button onClick={handleBack} className="auth-button secondary">
                  Back
                </button>
              )}
              <button type="submit" className="auth-button">
                {step === 4 ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
