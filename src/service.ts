export const ENDPOINTS = {
  transfers: {
    env: "KITEINDEX_TRANSFERS_URL",
    path: "/api/v1/transfers",
    description: "Token transfers and account flow events",
  },
  bridges: {
    env: "KITEINDEX_BRIDGES_URL",
    path: "/api/v1/bridges",
    description: "Bridge activity and cross-chain settlement records",
  },
  staking: {
    env: "KITEINDEX_STAKING_URL",
    path: "/api/v1/staking",
    description: "Validator, delegator, and staking position indexes",
  },
  usage: {
    env: "KITEINDEX_USAGE_URL",
    path: "/api/v1/usage",
    description: "API key plan, rate limit, and usage records",
  },
} as const;

export type EndpointName = keyof typeof ENDPOINTS;

export interface ServiceStatus {
  data_status: "connected" | "connectors_required";
  connected_endpoints: number;
  total_endpoints: number;
  missing_integrations: string[];
  endpoints: Array<{
    name: EndpointName;
    path: string;
    env: string;
    description: string;
    connected: boolean;
  }>;
}

export function getServiceStatus(): ServiceStatus {
  const endpoints = Object.entries(ENDPOINTS).map(([name, config]) => ({
    name: name as EndpointName,
    path: config.path,
    env: config.env,
    description: config.description,
    connected: Boolean(process.env[config.env]),
  }));

  return {
    data_status: endpoints.every((endpoint) => endpoint.connected)
      ? "connected"
      : "connectors_required",
    connected_endpoints: endpoints.filter((endpoint) => endpoint.connected).length,
    total_endpoints: endpoints.length,
    missing_integrations: endpoints
      .filter((endpoint) => !endpoint.connected)
      .map((endpoint) => endpoint.env),
    endpoints,
  };
}

export async function proxyEndpoint(endpoint: EndpointName, request: Request, apiKey: string) {
  const config = ENDPOINTS[endpoint];
  const upstream = process.env[config.env];

  if (!upstream) {
    return {
      status: 503,
      body: {
        data_status: "connectors_required",
        missing_integrations: [config.env],
        message: `${config.env} must point to a real KiteIndex data source.`,
      },
    };
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(upstream);
  requestUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  let response: Response;
  try {
    response = await fetch(upstreamUrl, {
      headers: {
        "X-API-Key": apiKey,
      },
      next: { revalidate: 60 },
    });
  } catch {
    return {
      status: 502,
      body: {
        error: "Upstream request failed",
        message: `${config.env} did not respond.`,
      },
    };
  }

  // Upstream may return a non-JSON body (e.g. an HTML gateway error page on a
  // 5xx, or an empty body). Parsing it blindly with response.json() would throw
  // and surface as an opaque 500 from this API, so handle it defensively.
  const text = await response.text();
  let body: unknown;
  if (text === "") {
    body = null;
  } else {
    try {
      body = JSON.parse(text);
    } catch {
      return {
        status: response.ok ? 502 : response.status,
        body: {
          error: "Upstream returned a non-JSON response",
          message: `${config.env} returned an unexpected response.`,
        },
      };
    }
  }

  return {
    status: response.status,
    body,
  };
}
