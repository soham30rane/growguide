"use server";

export default async function registerAction(formData) {
  console.log('Registering user:', formData);
  try {
    let res = await fetch("http://localhost:8000/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    let data = await res.json();
    console.log('Registration response:', data);
    if (!data.error) {
      return { success: true, token: data.token, username: data.username };
    }
    return { success: false };
  } catch (e) {
    console.error({ message: e.message });
  }
}
