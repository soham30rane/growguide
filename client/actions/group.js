"use server";

export default async function getGroup(uid) {
  try {
    let res = await fetch(`http://localhost:8000/group/get-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uid}),
    });
    let data = await res.json();
    if (!data.error) {
      return { success: true, groups: data.groups };
    }
    return { success: false };
  }
  catch (e) {
    console.error({ message: e.message });
  }
}