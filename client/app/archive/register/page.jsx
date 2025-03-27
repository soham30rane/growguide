"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import '@/styles/auth.css';
import '@/styles/agro.css';

const languageTexts = {
  English: {
    title: "Join GrowGuide",
    subtitle: "Create an account and start your plant journey",
    phoneLabel: "Phone Number",
    usernameLabel: "Username",
    passwordLabel: "Password",
    roleLabel: "Role",
    aboutLabel: "Write a bit about yourself",
    locationLabel: "Location",
    nextButton: "Next",
    submitButton: "Submit",
    backButton: "Back",
    loginPrompt: "Already have an account?",
    loginLink: "Log in",
  },
  Hindi: {
    title: "ग्रो गाइड से जुड़ें",
    subtitle: "एक खाता बनाएं और अपनी पौधों की यात्रा शुरू करें",
    phoneLabel: "फोन नंबर",
    usernameLabel: "उपयोगकर्ता नाम",
    passwordLabel: "पासवर्ड",
    roleLabel: "भूमिका",
    aboutLabel: "अपने बारे में थोड़ा लिखें",
    locationLabel: "स्थान",
    nextButton: "अगला",
    submitButton: "जमा करें",
    backButton: "वापस",
    loginPrompt: "पहले से ही एक खाता है?",
    loginLink: "लॉग इन करें",
  },
  // Add other languages here...
};

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: 'English',
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

  const texts = languageTexts[formData.language];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image">
          <img src="/images/plants-growing.svg" alt="Plants growing illustration" />
        </div>
        <div className="auth-form">
          <h1>{texts.title}</h1>
          <p className="subtitle">{texts.subtitle}</p>
          
          <form onSubmit={step === 4 ? handleSubmit : handleNext}>
            {step === 1 && (
              <div className="form-group">
                <label>Preferred Language</label>
                <div className="language-buttons">
                  {Object.keys(languageTexts).map((lang) => (
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
                  <label htmlFor="phone">{texts.phoneLabel}</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder={texts.phoneLabel}
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">{texts.usernameLabel}</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder={texts.usernameLabel}
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && <p className="error-text">{errors.username}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">{texts.passwordLabel}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={texts.passwordLabel}
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
                  <label htmlFor="role">{texts.roleLabel}</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={errors.role ? 'error' : ''}
                  >
                    <option value="">{texts.roleLabel}</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Expert/Consultant">Expert/Consultant</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                  {errors.role && <p className="error-text">{errors.role}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="about">{texts.aboutLabel}</label>
                  <textarea
                    id="about"
                    name="about"
                    placeholder={texts.aboutLabel}
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
                <label htmlFor="location">{texts.locationLabel}</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder={texts.locationLabel}
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
                  {texts.backButton}
                </button>
              )}
              <button type="submit" className="auth-button">
                {step === 4 ? texts.submitButton : texts.nextButton}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              {texts.loginPrompt} <Link href="/login">{texts.loginLink}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
