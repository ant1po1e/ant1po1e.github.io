import { head } from "@vercel/blob";
import crypto from "node:crypto";
import { verifyAuth } from "./_auth.js";

const SLUG_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_ATTEMPTS = 6;

function randomSlug(length = 5) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SLUG_CHARS[crypto.randomInt(0, SLUG_CHARS.length)];
  }
  return out;
}

export default async function handler(request, response) {
  if (!verifyAuth(request)) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const ext = request.query.ext;
  if (!ext || Array.isArray(ext) || !/^[a-z0-9]{1,10}$/i.test(ext)) {
    return response.status(400).json({ error: "Invalid extension." });
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const pathname = `v/${randomSlug()}.${ext}`;
    try {
      // head() throws if the blob doesn't exist — that's the "free" case.
      await head(pathname);
      // No throw means something is already there at this path — retry.
    } catch {
      return response.status(200).json({ pathname });
    }
  }

  return response
    .status(500)
    .json({ error: "Could not find a free slug, please try again." });
}
