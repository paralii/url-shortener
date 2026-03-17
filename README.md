# SHR.T — URL Shortener

A full-stack URL shortening service with click analytics and expiry control.

**Live:** https://url-shortener-three-alpha.vercel.app

---

## Features

- Shorten any URL instantly with an 8-character ID
- Collision-safe ID generation with atomic retry logic
- URL normalization — deduplicates semantically identical URLs (protocol, trailing slash, hostname casing)
- Link expiry — choose from preset durations (1h / 24h / 7d / 30d) or never
- Click tracking — total clicks, creation date, and active status per link
- Stats lookup by short ID or full short URL

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS v4, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Winston |
| Deployment | Vercel (client) · Render (server) · MongoDB Atlas (DB) |

## Project Structure

```
paralii-url-shortener/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/             # Fetch wrappers (urlApi.js)
│       └── components/      # ShortenForm, ResultCard, StatsLookup
└── server/                  # Express API
    └── src/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        ├── services/
        └── utils/
```

## API Endpoints

```
POST   /api/urls                     Create a short URL
GET    /api/:shortId                 Redirect to original URL (tracks click)
GET    /api/urls/:shortId/stats      Get link analytics
```

### POST /api/urls

**Request**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "expiresIn": 86400
}
```
`expiresIn` is in seconds. Omit or pass `null` for a permanent link.

**Response** — `201 Created` (new link) or `200 OK` (existing active link)
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortId": "xK9mP2qR",
  "expiresAt": "2026-03-18T10:00:00.000Z"
}
```

### GET /api/urls/:shortId/stats

```json
{
  "shortId": "xK9mP2qR",
  "originalUrl": "https://example.com/very/long/url",
  "clicks": 42,
  "isActive": true,
  "isExpired": false,
  "expiresAt": null,
  "createdAt": "2026-03-17T10:00:00.000Z"
}
```

## Running Locally

**Prerequisites:** Node.js 20+, MongoDB running locally

```bash
git clone https://github.com/paralii/url-shortener.git
cd url-shortener
```

**Server**
```bash
cd server
cp .env.example .env
npm install
npm run dev               # http://localhost:1122
```

**Client**
```bash
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:2005
```

**Environment variables**

`server/.env`
```
PORT=1122
MONGO_URI=mongodb://localhost:27017/url-shortener
CLIENT_URL=http://localhost:2005
NODE_ENV=development
```

`client/.env`
```
VITE_API_URL=http://localhost:1122/api
VITE_SHORT_BASE=http://localhost:1122/api
```

## Git Workflow

Each feature was built on a dedicated branch with a pull request into `master`:

| Branch | Description |
|---|---|
| `feature/server-security` | Express setup, middleware, logging |
| `feature/url-domain` | Mongoose model |
| `feature/url-service` | Short URL creation and redirect logic |
| `feature/url-controller` | Route wiring |
| `feature/url-validation` | URL normalization and sanitization |
| `feature/url-expiration` | Expiry support |
| `fix/server-path-to-regexp-route` | shortId validation moved to controller |
| `feature/url-stats` | Click analytics endpoint |
| `feature/frontend-ui` | Full React UI |
| `feature/tailwind-migration` | Migrated to Tailwind CSS v4 |
| `fix/expiry` | Preset expiry UI, fixed expired URL re-creation bug |
| `fix/wire-error-handler` | Global error handler middleware |
| `fix/error-handler-status-code` | BadRequestError status propagation |
