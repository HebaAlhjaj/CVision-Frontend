const BASE_URL =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function getMyProjects() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  const response = await fetch(`${BASE_URL}/team-member/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || "Failed to fetch projects"
    );
  }

  return data;
}