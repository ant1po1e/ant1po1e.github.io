import { checkPassword, createSessionCookie } from "./_auth.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { password } = body || {};

  try {
    if (!checkPassword(password)) {
      // small delay to soften brute-force attempts
      await new Promise((r) => setTimeout(r, 400));
      return response.status(401).json({ error: "Incorrect password." });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }

  response.setHeader("Set-Cookie", createSessionCookie());
  return response.status(200).json({ ok: true });
}
