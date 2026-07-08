import { get } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const parts = request.query.path;
  const pathname = Array.isArray(parts) ? parts.join("/") : parts;

  if (!pathname || !pathname.startsWith("v/")) {
    return response.status(400).json({ error: "Path tidak valid." });
  }

  try {
    const result = await get(pathname, { access: "public" });
    if (!result) {
      return response.status(404).json({ error: "Gambar tidak ditemukan." });
    }

    response.setHeader(
      "Content-Type",
      result.blob.contentType || "application/octet-stream"
    );
    // These are public images served under our own domain purely for a
    // nicer URL/embed — safe to let browsers and CDNs cache them hard.
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");

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
