const BASE_URL = "http://127.0.0.1:8000/projects";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }

  return data;
};

export const getProjectMembers = async (projectId, token) => {
  const res = await fetch(`${BASE_URL}/${projectId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(res);
};