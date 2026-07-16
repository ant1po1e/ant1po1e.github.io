import { handleUpload } from "@vercel/blob/client";
import { verifyAuth } from "./_auth.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAuth(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Auth already verified above. The client is responsible for
        // sending a pathname prefixed with "v/" (see src/lib/api.js).
        // Files are converted to WebP client-side before upload; GIFs are
        // sent through untouched to preserve animation.
        return {
          addRandomSuffix: false,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB
        };
      },
      onUploadCompleted: async () => {
        // no external DB to update — Vercel Blob's own listing is our source of truth
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
}
