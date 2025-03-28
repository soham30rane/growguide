"use server";

export default async function oneToOneChatAction(uid) {
  try {
    let res = await fetch(`http://localhost:8000/chat/one-to-one-chat/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let data = await res.json();
    if (res.ok) {
      return { success: true, chats: data }; // Return the chat data
    }
    return { success: false, error: data.detail || "Failed to fetch chats" };
  } catch (e) {
    console.error({ message: e.message });
    return { success: false, error: "An error occurred while fetching chats" };
  }
}
