"use server";
import { cookies } from 'next/headers';

export default async function registerAction(formData) {
  try {
    let res = await fetch("http://localhost:8000/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });
    let data = await res.json();
    console.log('Registration response:', data);
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
      return { success: true, token: data.token, username: data.username };
    }
    return { success: false };
  } catch (e) {
    console.error({ message: e.message });
  }
}
