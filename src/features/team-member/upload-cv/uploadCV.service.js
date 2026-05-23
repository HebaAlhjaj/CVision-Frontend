const BASE_URL = "http://127.0.0.1:8000";

export async function uploadCV(file) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/ai/analyze-cv`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "CV upload failed");
  }

  return data;
}