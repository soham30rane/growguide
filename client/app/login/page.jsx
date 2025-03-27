"use client"
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import Link from 'next/link';
import '@/styles/agro.css';
import '@/styles/auth.css';
import Image from 'next/image';
import loginAction from '@/actions/login';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await loginAction(formData);
      if (response.success) {
        // router.push("/dashboard");
      } else {
        setErrors(response.success);
        setErrorDialog(true); // Show error dialog
      }
      console.log(response.success);
    } catch (e) {
      console.log(e);
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
          <h1>Welcome Back!</h1>
          <p className="subtitle">Log in to track your plants' growth journey</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Phone Numeber</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="8881116669"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="forgot-password">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-button">
              Log In
            </button>

            {errorDialog && (
              <div className="error-dialog">
                <p>Login failed. Please check your credentials and try again.</p>
                <button onClick={() => setErrorDialog(false)}>Close</button>
              </div>
            )}
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link href="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
