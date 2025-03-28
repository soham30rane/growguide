"use server";
import { cookies } from 'next/headers';

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

export default async function loginAction(formData) {
  try {
    let res = await fetch("http://localhost:8000/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    let data = await res.json();
    if (!data.error) {
      const cookieStore = await cookies(); // Await cookies() before using it
      cookieStore.set('token', data.token);
      cookieStore.set('username', data.username);
      cookieStore.set('latitude', data.latitude);
      cookieStore.set('longitude', data.longitude);
      cookieStore.set('address', data.address);
      cookieStore.set('language_preference', data.language_preference);
      cookieStore.set('description', data.description);
      cookieStore.set('roles', data.roles);
      
      // Set Google Translate cookie based on user's language preference
      if (data.language_preference) {
        if (data.language_preference === 'English') {
          // For English, delete the cookie to show original content
          cookieStore.delete('googtrans');
        } else if (languageMap[data.language_preference]) {
          // For other languages, set the cookie
          cookieStore.set('googtrans', languageMap[data.language_preference]);
        }
      }
      
      // return { success: true, username: data.username }; // Return username in the response
      return {
        success: true,
        username: data.username,
        language_preference: data.language_preference
      }
    }
    return { success: false };
  } catch (e) {
    console.error({ message: e.message });
  }
}
