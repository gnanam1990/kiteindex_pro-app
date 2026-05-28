# KiteIndex Pro

Production-grade indexer + GraphQL API for Kite Mainnet.

## Features

- API key authentication
- Rate limiting (Redis-backed)
- Usage tracking and billing
- Advanced indexes (8+ contracts)
- Webhook system
- Free OSS tier for verified projects

## Pricing

| Plan | Price | Queries/mo | Rate Limit |
|---|---|---|---|
| Free | $0 | 100K | 10/s |
| Pro | $99 | 10M | 50/s |
| Enterprise | $999 | Custom | Custom |

## API

Production: https://kiteindex-pro-app.vercel.app

```bash
# List transfers
curl -H "X-API-Key: your_key" https://kiteindex-pro-app.vercel.app/api/v1/transfers

# Get bridge activity
curl -H "X-API-Key: your_key" https://kiteindex-pro-app.vercel.app/api/v1/bridges

# Check usage
curl -H "X-API-Key: your_key" https://kiteindex-pro-app.vercel.app/api/v1/usage
```

## Deployment

- **Production:** https://kiteindex-pro-app.vercel.app
- **Host:** Vercel project `kiteindex-pro-app`
- **Status:** landing page, API-key guard, and connector-required API responses verified on 2026-05-23.
- **Data:** live API responses require `KITEINDEX_TRANSFERS_URL`, `KITEINDEX_BRIDGES_URL`, `KITEINDEX_STAKING_URL`, and `KITEINDEX_USAGE_URL`.
- **Auth:** production API requests require either `KITEINDEX_PRO_API_KEY_HASHES` (comma-separated SHA-256 hashes) or `KITEINDEX_PRO_API_KEYS` (comma-separated raw keys). The `demo` key is accepted only outside production.

## Development

```bash
pnpm install
pnpm dev
```
