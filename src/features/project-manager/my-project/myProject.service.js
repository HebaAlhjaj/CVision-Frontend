const BASE_URL = "http://127.0.0.1:8000/projects";

const handleResponse = async (res) => {
  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }

  return data;
};

export const getMyProjects = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/my-projects`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Get Projects Error:", err.message);
    return [];
  }
};

export const createProject = async (data, token) => {
  try {
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Create Project Error:", err.message);
    throw err;
  }
};

export const inviteToProject = async (projectId, email, token) => {
  try {
    const res = await fetch(`${BASE_URL}/invite/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Invite Error:", err.message);
    throw err;
  }
};

export const deleteProject = async (projectId, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
};

export const updateProject = async (projectId, data, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
};