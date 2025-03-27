"use server";
import axios from "axios";

export default async function fetchBlogsAction() {
  try {
    const res = await axios.get("http://127.0.0.1:8000/blog/get-blogs", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
        console.log(res.data.blogs);
      return { success: true, blogs: res.data.blogs || [] };
    }
    return { success: false, blogs: [] };
  } catch (e) {
    console.error({ message: e.message });
    return { success: false, blogs: [] };
  }
}
