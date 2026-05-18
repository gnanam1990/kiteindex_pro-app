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

```bash
# List transfers
curl -H "X-API-Key: your_key" https://api.kiteindex.xyz/v1/transfers

# Get bridge activity
curl -H "X-API-Key: your_key" https://api.kiteindex.xyz/v1/bridges

# Check usage
curl -H "X-API-Key: your_key" https://api.kiteindex.xyz/v1/usage
```

## Development

```bash
npm install
npm run dev
```
