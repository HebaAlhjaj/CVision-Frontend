const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function login(payload) {
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

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Login failed");
  }

  // 🔥 نضمن وجود full_name
  return {
    ...data,
    full_name:
      data.full_name ||
      data.username ||
      data.email ||
      "User",
  };
}