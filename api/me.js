import { verifyAuth } from "./_auth.js";

export default async function handler(request, response) {
  const authenticated = verifyAuth(request);
  return response.status(200).json({ authenticated });
}
