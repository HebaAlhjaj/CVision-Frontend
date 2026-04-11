const BASE_URL = "http://127.0.0.1:8000/projects";

// Get Projects
export const getMyProjects = async (token) => {
  const res = await fetch(`${BASE_URL}/my-projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

// Create Project
export const createProject = async (data, token) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// 🔥 Invite by Email
export const inviteToProject = async (projectId, email, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  return await res.json();
};