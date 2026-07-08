import { del } from "@vercel/blob";
import { verifyAuth } from "./_auth.js";

export default async function handler(request, response) {
  if (!verifyAuth(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }
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

  const { url } = body || {};
  if (!url || !url.includes("/v/")) {
    return response.status(400).json({ error: "Invalid image URL." });
  }

  try {
    await del(url);
    return response.status(200).json({ ok: true });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
