# Project Context

You are rebuilding a live product amazon.com. Prioritize readability when writing code.


# Workflow

- The live deployed link is what gets judged, not localhost. Assume every
  feature needs to actually work at the deployed URL for a visitor who is
  not signed in.
- `feature_list.json` in the repo root is the scope source of truth. Before
  building anything, check it. Build `must_have_features` in order first.
  Only touch `nice_to_have_features` if all must-haves are done and
  deployed-working. Never build anything in `out_of_scope_features` - if
  asked to add one, point back at the documented reason it was cut.
- `.agent-logs/` must be committed incrementally throughout the build, not
  in one lump at the end. Remind me to commit it after each meaningful
  chunk of work if I forget.
- Start implementation of each feature in plan mode. Once plan is done review 
  once with software-architect subagent. Apply the suggested changes only where necessary
- Make sure to maintain .gitignore with all files and directories that should not be committed

## Stack
 
- Next.js (App Router) + TypeScript + Tailwind CSS
- Zustand for client state (cart only)
- Prisma ORM against Postgres (Neon Postgres) - **not** SQLite,
  file-based SQLite does not persist on Netlify's serverless functions
- Deployment: Netlify


## Coding standards
 
**TypeScript**
- Strict mode on. No `any` - if a type is genuinely unknown, use `unknown`
  and narrow it.
- Explicit types on component props, API route inputs, and API responses.
  Infer everything else.
**File & folder structure**
- `app/` - routes and layouts only, minimal logic inline
- `components/` - reusable UI, one component per file, PascalCase filenames
  matching the component name
- `lib/` - pure functions: pricing math, filtering/sorting, formatting
- `lib/db.ts` - single shared Prisma client instance (don't instantiate
  `new PrismaClient()` in multiple files - this breaks on serverless
  cold-starts and connection limits)
- `prisma/schema.prisma` + `prisma/seed.ts`
- `store/` - Zustand stores

## Testing guidance
 
Testing should be **targeted, not exhaustive**. Don't
spend hours on test infrastructure - spend minutes on tests that protect
the logic most likely to silently break.
 
**Worth writing (Vitest - faster to set up than Jest in a Next.js project):**
- Cart logic: add item, update quantity, remove item, subtotal calculation.
  This is pure, reused everywhere, and easy to get subtly wrong.
- Checkout order-creation logic: given a cart payload, confirm an `Order`
  and its `OrderItem` rows are created correctly. Doesn't need to be a full
  integration test against a live DB - testing the function that builds the
  Prisma write from cart input is enough.
- Any pure utility in `lib/` (price formatting, filter/sort helpers).
**Not worth it for this window:**
- Full E2E suites (Playwright/Cypress) - good practice normally, disproportionate
  here.
- Visual regression testing.
- Tests for static, logic-free components (Footer, static banners).
Run through this so your agent captures its prompts and responses into the repository: 8x agent capture setup


## Definition of done (per feature)
 
A feature from `feature_list.json` is done when:
- It works on the deployed Netlify URL, not just localhost
- Its listed edge cases have a visible UI state
- Relevant `.agent-logs/` are committed
- If it's a must-have with meaningful logic (cart, checkout), it has a
  quick Vitest test per the guidance above
## Do not
 
- Add real authentication or session-based accounts
- Integrate a real payment processor
- Switch the database back to file-based SQLite for "simplicity" - it will
  break checkout on the deployed link
- Batch `.agent-logs/` commits at the end instead of throughout
- Build anything listed in `feature_list.json`'s `out_of_scope_features`
