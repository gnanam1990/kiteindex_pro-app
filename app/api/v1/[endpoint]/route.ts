import { NextResponse } from "next/server";
import { validateApiKey } from "@/src/middleware/api-key";
import { ENDPOINTS, proxyEndpoint, type EndpointName } from "@/src/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;
  if (!isEndpoint(endpoint)) {
    return NextResponse.json({ error: "Unknown endpoint" }, { status: 404 });
  }

  const apiKey = validateApiKey(request);
  if (!apiKey.ok) {
    return NextResponse.json(
      { error: apiKey.error, code: apiKey.code },
      { status: apiKey.status }
    );
  }

  const result = await proxyEndpoint(endpoint, request, apiKey.apiKey);
  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      // Responses vary by API key (sent via header, so it is not part of the
      // URL cache key). A shared/CDN cache would serve one caller's
      // authenticated data to another. Keep caching private to the client.
      "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
    },
  });
}

function isEndpoint(endpoint: string): endpoint is EndpointName {
  return endpoint in ENDPOINTS;
}
