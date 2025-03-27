"use server";
import { cookies } from 'next/headers';

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
      return { success: true, username: data.username }; // Return username in the response
    }
    return { success: false };
  } catch (e) {
    console.error({ message: e.message });
  }
}
