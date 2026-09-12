# Amazon.com clone

A demo storefront rebuilt for the 8x Engineer 24-hour assignment.

- **Live:** https://amazon-clone-8x-gulsher.netlify.app
- **Scope:** `feature_list.json` is the source of truth for what is in, out, and why.

## Stack

- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4
- Zustand for the cart (persisted to `localStorage`, works for anonymous visitors)
- Prisma 6 against Neon Postgres (network-reachable, so checkout works on the deployed link)
- Deployed on Netlify (`netlify.toml`), git-linked to `main`

## Running locally

```bash
npm install
# .env.local needs DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct) from Neon
npm run db:migrate          # apply prisma/migrations
npm run db:seed             # load prisma/products.json (194 products, 24 categories)
npm run dev
```

Checks: `npm run typecheck`, `npm test` (Vitest on the pure `lib/` helpers), `npm run build`.

## Layout

| Folder | Purpose |
|---|---|
| `app/` | routes, layouts and route handlers only |
| `components/` | one React component per file |
| `lib/` | pure functions (cart math, search filter, price formatting) + `db.ts` Prisma singleton |
| `store/` | Zustand cart store |
| `prisma/` | schema, migrations, seed snapshot |

## Intentional scope cuts

- **No real payments** — checkout has a mock payment step; orders are still written to Postgres.
- **No real authentication** — the account menu is a visual stub. The live link must work for someone who is not signed in.
- **No search relevance ranking** — the header search is a client-side substring filter on name/category.
- **Cart prices are snapshotted** when an item is added; a later price change on the product is not reflected in an existing cart line.
