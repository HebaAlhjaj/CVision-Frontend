const BASE_URL = "http://127.0.0.1:8000/projects";

export const getSkillGaps = async (projectId, token) => {
  const res = await fetch(
    `${BASE_URL}/${projectId}/skill-gap`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch skill gaps");
  }

  return res.json();
};