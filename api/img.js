import { get } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const pathname = request.query.p;

  if (!pathname || Array.isArray(pathname) || !pathname.startsWith("v/")) {
    return response.status(400).json({ error: "Invalid path." });
  }

  try {
    const result = await get(pathname, { access: "public" });
    if (!result) {
      return response.status(404).json({ error: "Image not found." });
    }

    response.setHeader(
      "Content-Type",
      result.blob.contentType || "application/octet-stream"
    );
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
    return response.status(404).json({ error: "Image not found." });
  }
}
