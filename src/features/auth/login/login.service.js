const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function login(payload) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data = {};

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    console.log("LOGIN RESPONSE:", data);

    // 🔴 إذا في خطأ
    if (!res.ok) {
      throw new Error(data?.detail || data?.message || "Login failed");
    }

    // 🔥 أهم نقطة: استخراج التوكن
    const token = data.access_token || data.token;

    if (!token) {
      throw new Error("No token returned from server");
    }

    // 🔥 رجّع بيانات مرتبة
    return {
      token, // 👈 هذا اللي رح تستخدمه
      full_name:
        data.full_name ||
        data.username ||
        data.email ||
        "User",
      ...data,
    };

  } catch (err) {
    console.error("Login Error:", err.message);
    throw err;
  }
}