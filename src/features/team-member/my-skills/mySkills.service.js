const API_BASE = import.meta.env.VITE_API_BASE;

export async function getMySkills() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_BASE}/team-member/my-skills`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Failed to load skills");
  }

  return data;
}