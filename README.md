# KiteIndex Pro

> A thin Next.js proxy API that fronts an upstream Kite indexer, adding API-key authentication and a connector-status landing page.

![Language: TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6)

## Overview

KiteIndex Pro is a lightweight API gateway for Kite Mainnet data. It does not index the chain itself; instead, it exposes a small set of REST endpoints (`transfers`, `bridges`, `staking`, `usage`) that proxy requests to upstream KiteIndex data sources configured via environment variables. On top of the upstream it adds SHA-256 API-key authentication and a landing page that reports which connectors are wired up. It is intended for teams that already run a Kite indexer and want a public, key-guarded front door to it.

## Features

- **Key-guarded REST endpoints** — `GET /api/v1/{transfers,bridges,staking,usage}`, each forwarded to its configured upstream URL.
- **API-key authentication** — keys are accepted via the `X-API-Key` header, an `Authorization: Bearer <key>` header, or an `api_key` query parameter, then matched against configured SHA-256 hashes using a constant-time comparison.
- **Upstream proxying** — incoming query parameters are forwarded to the upstream, the caller's API key is passed through as `X-API-Key`, and non-JSON or failed upstream responses are handled defensively (502 instead of an opaque 500).
- **Connector-status landing page** — the home page reports each endpoint, its backing env var, and whether it is connected.
- **Private response caching** — authenticated responses are returned with `Cache-Control: private` so a shared/CDN cache never serves one caller's data to another.
- **Demo key for local development** — when no keys are configured and `NODE_ENV` is not `production`, the literal key `demo` is accepted so the endpoints can be exercised locally.

The pricing/plan tiers and the SQL schema under `db/` describe an intended billing and usage-tracking model. Note that the proxy itself does not currently enforce per-tier rate limits, quotas, or usage accounting against a database — those are not wired into the request path. See [Status](#status).

## Tech stack

- **Next.js 16** (App Router) with **React 19**
- **TypeScript**
- Node.js `crypto` (`createHash`, `timingSafeEqual`) for API-key hashing and comparison
- **pnpm** for package management
- PostgreSQL schema (`db/schema.sql`) for the intended users/keys/usage model

## Architecture

- `app/` — Next.js App Router. `page.tsx` renders the connector-status landing page; `api/v1/[endpoint]/route.ts` is the single dynamic API route that authenticates the request and proxies to the upstream.
- `src/service.ts` — the `ENDPOINTS` registry (name → env var, path, description), `getServiceStatus()` for the landing page, and `proxyEndpoint()` which performs the upstream fetch.
- `src/middleware/api-key.ts` — `readApiKey()` / `validateApiKey()`: key extraction and SHA-256 constant-time validation.
- `src/index.ts` — re-exports the service module.
- `db/schema.sql` — Postgres schema for the intended users, API keys, and usage tables (not currently read by the proxy).

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Configuration

Set the following environment variables (e.g. in `.env.local`, which is gitignored). Values are examples only — never commit real secrets.

| Variable | Purpose |
|---|---|
| `KITEINDEX_TRANSFERS_URL` | Upstream URL for the `transfers` endpoint. |
| `KITEINDEX_BRIDGES_URL` | Upstream URL for the `bridges` endpoint. |
| `KITEINDEX_STAKING_URL` | Upstream URL for the `staking` endpoint. |
| `KITEINDEX_USAGE_URL` | Upstream URL for the `usage` endpoint. |
| `KITEINDEX_PRO_API_KEY_HASHES` | Comma-separated SHA-256 hex hashes of accepted API keys. |
| `KITEINDEX_PRO_API_KEYS` | Comma-separated raw API keys (hashed at runtime). Use this or the hashes variable. |
| `NODE_ENV` | Provided by Next.js. When not `production` and no keys are configured, the `demo` key is accepted. |

An endpoint with no configured upstream URL returns `503` with a `connectors_required` payload listing the missing variable. If neither `KITEINDEX_PRO_API_KEY_HASHES` nor `KITEINDEX_PRO_API_KEYS` is set (and `NODE_ENV` is `production`), authenticated requests return `503 API_KEYS_NOT_CONFIGURED`.

### Running

```bash
pnpm dev      # start the development server
pnpm build    # production build
pnpm start    # serve the production build
```

## Usage

Every data endpoint requires an API key. Supply it via the `X-API-Key` header (recommended), an `Authorization: Bearer` header, or the `api_key` query parameter:

```bash
# Header auth (recommended)
curl -H "X-API-Key: your_key" http://localhost:3000/api/v1/transfers

# Bearer auth
curl -H "Authorization: Bearer your_key" http://localhost:3000/api/v1/bridges

# Query-parameter auth (handy in a browser)
curl "http://localhost:3000/api/v1/usage?api_key=your_key"
```

In local development with no keys configured, use `api_key=demo`. Query parameters on the request (other than `api_key`) are forwarded to the upstream.

Available endpoints:

| Path | Description |
|---|---|
| `/api/v1/transfers` | Token transfers and account flow events |
| `/api/v1/bridges` | Bridge activity and cross-chain settlement records |
| `/api/v1/staking` | Validator, delegator, and staking position indexes |
| `/api/v1/usage` | API key plan, rate limit, and usage records |

Responses:

- `200` — proxied upstream payload.
- `401` — missing or invalid API key (`MISSING_API_KEY` / `INVALID_API_KEY`).
- `404` — unknown endpoint name.
- `502` — upstream did not respond, or returned a non-JSON response.
- `503` — upstream not configured (`connectors_required`) or API keys not configured (`API_KEYS_NOT_CONFIGURED`).

## Project structure

```
app/
  layout.tsx
  page.tsx                     # connector-status landing page
  globals.css
  api/v1/[endpoint]/route.ts   # auth + proxy route
src/
  index.ts
  service.ts                   # endpoint registry, status, proxy
  middleware/api-key.ts        # API-key validation
db/
  schema.sql                   # intended users/keys/usage schema
public/brand/                  # logo assets
```

## Status

Preview / scaffold. The deployable shell is real and working: the landing page, API-key guard, upstream proxying, and connector-status reporting all function. However:

- Endpoint data is **disabled until upstream connector URLs are configured** — without them, each endpoint returns a `connectors_required` response.
- The proxy does **not** itself implement rate limiting, monthly quotas, usage/billing accounting, or webhooks. The pricing tiers shown on the landing page and the tables in `db/schema.sql` describe the intended model but are not enforced in the request path.
- There are no automated tests in this repository.

## License

No license specified.
