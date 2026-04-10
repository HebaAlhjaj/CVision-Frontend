const BASE_URL = "http://localhost:5000/projects";

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

// Invite Email
export const inviteByEmail = async (project_id, email, token) => {
  const res = await fetch(`${BASE_URL}/${project_id}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  return await res.json();
};

// Invite Link
export const getInviteLink = async (project_id, token) => {
  const res = await fetch(`${BASE_URL}/${project_id}/invite-link`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};