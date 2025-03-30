"use server";
import { cookies } from 'next/headers';

export default async function registerAction(formData) {
  try {
    // Get data ready for submission
    console.log('Form data:', formData);
    
    // Make the request to your API
    const response = await fetch("http://127.0.0.1:8000/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      cache: 'no-store' // Important: prevent caching
    });
    
    // Parse the response
    const data = await response.json();
    console.log('API response data:', data);
    
    // Check for successful registration
    if (!data.error) {
      // Set cookies with user data
      const cookieStore = cookies();
      cookieStore.set('token', data.token);
      cookieStore.set('username', data.username);
      cookieStore.set('latitude', data.latitude.toString());
      cookieStore.set('longitude', data.longitude.toString());
      cookieStore.set('address', data.address);
      cookieStore.set('language_preference', data.language_preference);
      cookieStore.set('description', data.description);
      cookieStore.set('roles', data.roles);
      
      // Return success to the client
      return { 
        success: true, 
        token: data.token, 
        username: data.username 
      };
    }
    
    // Return error to the client with message
    return { 
      success: false, 
      message: data.message || "Registration failed"
    };
  } catch (error) {
    // Log the full error for debugging
    console.error('Registration action error:', error);
    
    // Return a formatted error to the client
    return { 
      success: false, 
      message: error.message || "An error occurred during registration"
    };
  }
}