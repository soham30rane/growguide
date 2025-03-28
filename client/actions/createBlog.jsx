"use server";
import axios from "axios";

export default async function createBlogAction(blogData) {
  try {
    const res = await axios.post("http://127.0.0.1:8000/blog/create-blog", blogData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.data.error);
    if (res.status === 200 && !res.data.error) {
      return { success: true };
    }
    return { success: false, error: res.data.error || true };
  } catch (e) {
    console.error({ message: e.message });
    return { success: false, error: true };
  }
}