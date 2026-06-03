const BASE_URL = "http://127.0.0.1:8000";

export async function uploadCV(file, token) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/cv/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "CV upload failed");
  }

  return data;
}