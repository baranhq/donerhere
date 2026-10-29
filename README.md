# DönerHere!

A fictional döner restaurant demo built with React and TypeScript. It includes accounts, a persistent cart, delivery and collection checkout, and a staff dashboard. Store locations and contact details are placeholders; orders are saved locally. No payment provider or real restaurant dispatch is connected.

## Setup

Requires Node.js 24+ and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open [localhost:5173](http://localhost:5173). SQLite (public domain) initializes automatically outside Git in `data/store.sqlite`.

## Features

- Registration with password confirmation, login/logout, profile/password updates, and account deletion.
- Salted scrypt passwords, signed HttpOnly sessions, origin checks, rate limits, and server-side staff permissions.
- Persistent cart quantities, removal, EUR totals, and checkout with in-place sign-in.
- Delivery and collection orders with simple order numbers, staff status controls, and timestamped order history.
- Product/category management, searchable product rows, image uploads, size prices, availability, and product SEO fields.
- Admin-only user creation, role changes, and account removal.
- Responsive pages, mobile navigation, and accessible license accordions.

Register an account, then grant the first staff role on the trusted server:

```bash
npm run employee -- employee@example.com
npm run admin -- admin@example.com
```

## Configuration & production

See [.env.example](.env.example) and [development guide](docs/development.md). SQLite data and uploads stay outside Git. Production requires an HTTPS origin, a random `SESSION_SECRET` of at least 32 characters, and a trusted local reverse proxy.

```bash
npm run build
npm start
```

The Node server serves both `dist` and `/api`. Static hosting alone cannot run the backend.

## Checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

Storybook: `npm run storybook`. Story tests: `npm run test:stories` (requires Playwright Chromium).

## Used Apps / Technologies

[Open the full technology inventory](docs/technologies.md) for the stack, direct dependencies, versions, and licenses. The website’s `/licenses` page also includes transitive dependencies and full notices.
