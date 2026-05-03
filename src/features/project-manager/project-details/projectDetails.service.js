const BASE_URL = "http://127.0.0.1:8000/projects";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }

  return data;
};

// Get Roles
export const getRoles = async (projectId, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
};

// Create Role
export const createRole = async (projectId, data, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
};

// Delete Role
export const deleteRole = async (roleId, token) => {
  const res = await fetch(`${BASE_URL}/roles/${roleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
};