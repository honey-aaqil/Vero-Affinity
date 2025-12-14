# Firebase Studio

This is a Next.js starter built in Firebase Studio.

## Local development

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure environment variables

   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:

   - `MONGODB_URI` – MongoDB connection string
   - `MONGODB_DB` – database name
   - `SESSION_SECRET` – app/session secret

3. Start the dev server

   ```bash
   npm run dev
   ```

## Verify MongoDB connection

With MongoDB running and your `.env.local` configured, visit:

- `http://localhost:9002/api/health/db`

It should return JSON like:

```json
{ "ok": true, "db": "your-db-name" }
```

## Server-side Mongo helpers

- `src/lib/server/env.ts` – loads + validates server environment variables
- `src/lib/server/mongo.ts` – singleton `MongoClient` + `getDb()`/`getCollection()`
- `src/lib/server/collections.ts` – centralized, typed collection helpers (users/chats/audit log/GridFS)
