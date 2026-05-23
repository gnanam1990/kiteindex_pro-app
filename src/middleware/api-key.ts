export function readApiKey(request: Request) {
  const url = new URL(request.url);
  return request.headers.get("x-api-key") ?? url.searchParams.get("api_key");
}
