const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  console.log("SIGNUP RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Signup failed");
  }

  // 🔥 نفس الحركة
  return {
    ...data,
    full_name:
      data.full_name ||
      data.username ||
      data.email ||
      "User",
  };
}