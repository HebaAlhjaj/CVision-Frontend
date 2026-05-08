const BASE_URL = "http://127.0.0.1:8000/projects";

export const getRoleMatching = async (projectId, token) => {
  const res = await fetch(
    `${BASE_URL}/${projectId}/matching`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch role matching");
  }

  return res.json();
};