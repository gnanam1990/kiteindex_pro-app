import type { Context, Next } from "hono";

export async function apiKeyMiddleware(c: Context, next: Next) {
  const apiKey = c.req.header("X-API-Key") || c.req.query("api_key");

  if (!apiKey) {
    return c.json({ error: "Missing API key" }, 401);
  }

  // In production, validate against database
  // For now, accept any key
  await next();
}
