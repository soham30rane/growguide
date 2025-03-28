'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import '@/styles/agro.css';
import { FiUser, FiGlobe, FiMapPin, FiInfo, FiTag } from 'react-icons/fi';

const SettingsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    language_preference: '',
    roles: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Map of languages to Google Translate codes
  const languageMap = {
    'English': '/auto/en',
    'Hindi': '/auto/hi',
    'Marathi': '/auto/mr',
    'Telugu': '/auto/te',
    'Kannada': '/auto/kn',
    'Gujarati': '/auto/gu',
    'Punjabi': '/auto/pa'
  };

  useEffect(() => {
    // Load user data from cookies
    const userData = {
      username: getCookie('username') || '',
      language_preference: getCookie('language_preference') || 'English',
      roles: getCookie('roles') || '',
      description: getCookie('description') || '',
      address: getCookie('address') || '',
      latitude: parseFloat(getCookie('latitude')) || 0,
      longitude: parseFloat(getCookie('longitude')) || 0,
    };
    
    setFormData(userData);
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.language_preference) newErrors.language_preference = 'Language is required';
    if (!formData.roles) newErrors.roles = 'Role is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setIsLoading(true);
      
      try {
        // Here you would typically call an API to update the user's settings
        // For now, we'll just update the cookies
        setCookie('username', formData.username);
        setCookie('language_preference', formData.language_preference);
        setCookie('roles', formData.roles);
        setCookie('description', formData.description);
        setCookie('address', formData.address);
        setCookie('latitude', formData.latitude.toString());
        setCookie('longitude', formData.longitude.toString());
        
        setSuccessMessage('Settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error updating settings:', error);
        setErrors({ form: 'Failed to update settings. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const changeLanguage = (lang) => {
    // Update form data
    setFormData({
      ...formData,
      language_preference: lang
    });
    
    // For English, remove the cookie to show original content
    if (lang === 'English') {
      deleteCookie('googtrans', { path: '/', domain: window.location.hostname });
      deleteCookie('googtrans', { path: '/' });
      
      // Also try to expire the cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } 
    // For other languages, set the cookie as before
    else if (languageMap[lang]) {
      const cookieOptions = { 
        path: '/',
        domain: window.location.hostname
      };
      
      setCookie('googtrans', decodeURI(languageMap[lang]), cookieOptions);
      
      document.cookie = `googtrans=${encodeURIComponent(languageMap[lang])}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=${encodeURIComponent(languageMap[lang])}; path=/`;
    }
    
    // Reload page to apply translation changes
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Settings</h1>
          </div>
          
          {/* Success message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              {successMessage}
            </div>
          )}
          
          {/* Error message */}
          {errors.form && (
            <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* User Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-2">
                        <FiUser className="text-gray-500" /> Username
                      </span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled
                      className="bg-gray-100 text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                  
                  {/* Role */}
                  <div>
                    <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-2">
                        <FiTag className="text-gray-500" /> Role
                      </span>
                    </label>
                    <select
                      id="roles"
                      name="roles"
                      value={formData.roles}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.roles ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select a role</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Expert/Consultant">Expert/Consultant</option>
                      <option value="Service Provider">Service Provider</option>
                    </select>
                    {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles}</p>}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <FiInfo className="text-gray-500" /> About You
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your role or expertise"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>
            
            {/* Location Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              </div>
              <div className="p-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" /> Address
                    </span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>
              </div>
            </div>
            
            {/* Language Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  <span className="flex items-center gap-2">
                    <FiGlobe className="text-gray-500" /> Language Preference
                  </span>
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['English', 'Hindi', 'Marathi', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi'].map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={`px-3 py-2 rounded-md ${
                        formData.language_preference === lang 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => changeLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {errors.language_preference && (
                  <p className="mt-2 text-xs text-red-600">{errors.language_preference}</p>
                )}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => router.push('/dashboard')} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
