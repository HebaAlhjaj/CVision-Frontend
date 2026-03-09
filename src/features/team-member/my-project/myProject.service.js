const BASE_URL = "http://127.0.0.1:8000";

export async function getMyProjects() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/team-member/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}