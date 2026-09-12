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
| `lib/` | pure functions (cart math, catalog URL ↔ Prisma query, price formatting) + `db.ts` Prisma singleton |
| `store/` | Zustand cart store |
| `prisma/` | schema, migrations, seed snapshot |

## Product listing (`/s`)

Search, category browsing and deals all land on `/s`, like amazon.com. The URL is the source of truth
(`k`, `category`, `minPrice`, `maxPrice` in dollars, `sort=featured|price-asc|price-desc|rating-desc`,
`page`, `deals=true`); `lib/catalog.ts` parses it into a Prisma query and `GET /api/products` accepts the
same params. Filters are plain links and a GET form, so the page works without JavaScript.

## Cart (`/cart`)

Fully client-side: `store/cart.ts` (Zustand + `persist`) keeps the cart in this browser's `localStorage`, so it
survives refresh and needs no login. All math is in `lib/cart.ts` (unit-tested). Setting a line's quantity to
`0 (Delete)` removes it, like amazon.com. The "FREE Shipping" line uses Amazon's $35 threshold but is cosmetic —
nothing is ever charged for shipping.

## Intentional scope cuts

- **No real payments** — checkout has a mock payment step; orders are still written to Postgres.
- **No real authentication** — the account menu is a visual stub. The live link must work for someone who is not signed in.
- **No search relevance ranking** — search is a case-insensitive substring match on name/category in SQL (Prisma `contains`).
- **Cart price and stock are snapshotted** when an item is added and only refreshed if the same product is added again; the cart page never re-fetches, so a later price or stock change on the product is not reflected in an existing line.
