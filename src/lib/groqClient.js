// simple wrapper using fetch so you can inspect requests easily
export async function groq(path, body) {
  const base = process.env.GROQ_API_BASE || "https://api.groq.com/openai/v1";
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }
  return res.json();
}
