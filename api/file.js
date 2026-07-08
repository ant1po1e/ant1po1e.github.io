import { get } from "@vercel/blob";
import { verifyAuth } from "./_auth.js";

export default async function handler(request, response) {
  if (!verifyAuth(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const pathname = request.query.pathname;
  if (!pathname || Array.isArray(pathname) || !pathname.startsWith("v/")) {
    return response.status(400).json({ error: "Path gambar tidak valid." });
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (!result) {
      return response.status(404).json({ error: "Gambar tidak ditemukan." });
    }

    response.setHeader("Content-Type", result.blob.contentType || "application/octet-stream");
    response.setHeader("Cache-Control", "private, no-cache");
    // Node's response supports piping a web ReadableStream via Readable.fromWeb in newer runtimes;
    // Vercel's Node functions accept the web stream directly here.
    const reader = result.stream.getReader();
    response.status(200);
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        response.end();
        return;
      }
      response.write(Buffer.from(value));
      await pump();
    };
    await pump();
  } catch (err) {
    return response.status(404).json({ error: "Gambar tidak ditemukan." });
  }
}
