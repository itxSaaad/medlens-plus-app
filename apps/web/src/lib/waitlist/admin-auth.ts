import { getWaitlistAdminApiKey } from "@/lib/site/env";

export function isAuthorizedAdmin(request: Request): boolean {
  const apiKey = getWaitlistAdminApiKey();
  if (!apiKey) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  return token.length > 0 && token === apiKey;
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized." }, { status: 401 });
}
