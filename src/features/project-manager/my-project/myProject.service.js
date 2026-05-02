const BASE_URL = "http://127.0.0.1:8000/projects";

// 🟢 helper function لفحص الأخطاء
const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }
  return res.json();
};

// 🔹 Get Projects
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

// 🔹 Create Project
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

// 🔥 Invite by Email
export const inviteToProject = async (projectId, email, token) => {
  try {
    const res = await fetch(`${BASE_URL}/${projectId}/invite`, {
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
// 🔥 Delete Project
export const deleteProject = async (projectId, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
};

// 🔥 Update Project
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