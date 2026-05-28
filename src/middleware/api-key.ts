import { createHash, timingSafeEqual } from "node:crypto";

export type ApiKeyValidation =
  | { ok: true; apiKey: string }
  | {
      ok: false;
      status: 401 | 503;
      error: string;
      code: "MISSING_API_KEY" | "INVALID_API_KEY" | "API_KEYS_NOT_CONFIGURED";
    };

export function readApiKey(request: Request) {
  const url = new URL(request.url);
  return (
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("api_key")
  );
}

export function validateApiKey(request: Request): ApiKeyValidation {
  const apiKey = readApiKey(request)?.trim();
  if (!apiKey) {
    return {
      ok: false,
      status: 401,
      error: "Missing API key",
      code: "MISSING_API_KEY",
    };
  }

  const keyHashes = configuredKeyHashes();
  if (keyHashes.length === 0) {
    if (process.env.NODE_ENV !== "production" && apiKey === "demo") {
      return { ok: true, apiKey };
    }

    return {
      ok: false,
      status: 503,
      error: "API keys are not configured",
      code: "API_KEYS_NOT_CONFIGURED",
    };
  }

  const incomingHash = sha256(apiKey);
  const matched = keyHashes.some((hash) => timingSafeHexEqual(hash, incomingHash));
  if (!matched) {
    return {
      ok: false,
      status: 401,
      error: "Invalid API key",
      code: "INVALID_API_KEY",
    };
  }

  return { ok: true, apiKey };
}

function configuredKeyHashes(): string[] {
  const hashes = splitEnv(process.env.KITEINDEX_PRO_API_KEY_HASHES)
    .map((hash) => hash.toLowerCase())
    .filter((hash) => /^[a-f0-9]{64}$/.test(hash));
  const rawKeys = splitEnv(process.env.KITEINDEX_PRO_API_KEYS).map(sha256);

  return [...hashes, ...rawKeys];
}

function splitEnv(value: string | undefined): string[] {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function timingSafeHexEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
