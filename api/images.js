import { list } from "@vercel/blob";
import { verifyAuth } from "./_auth.js";

export default async function handler(request, response) {
  if (!verifyAuth(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blobs } = await list({ prefix: "v/" });
    const images = blobs
      .filter((b) => b.pathname.startsWith("v/"))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        name: b.pathname.replace(/^v\//, ""),
        size: b.size,
        uploadedAt: b.uploadedAt,
      }));
    return response.status(200).json({ images });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
