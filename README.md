<p align="center">
  <img src="src/assets/logo/donerhere_logo.png" alt="DönerHere!" width="420" />
</p>

# DönerHere!

A fictional döner shop demo for browsing a menu, placing pickup or delivery orders, and managing the store through staff tools. Built with React, TypeScript, Vite, Express, and SQLite.

## Run locally

Requires Node.js 24+ and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open [localhost:5173](http://localhost:5173). The local SQLite database is created automatically in `data/store.sqlite`.

## What’s inside

- A storefront with product categories, photos, prices, and homepage promotions
- Accounts, a persistent cart, delivery or collection checkout, and order history
- Staff tools for updating products and orders, managing users and permissions, and viewing store analytics

## Staff access

Create an account in the app, then run one of these commands on the trusted server to grant it a staff role:

```bash
npm run employee -- employee@example.com
# or
npm run admin -- admin@example.com
```

## Production

Build and start the app with `npm run build` and `npm start`. The Node.js server serves the website and its API together, so static-only hosting will not support accounts or orders. See the [development guide](docs/development.md) for configuration and hosting details.

## Technologies & licenses

See the [technology inventory](docs/technologies.md) for the stack and direct dependencies, and [LICENSES.md](LICENSES.md) for dependency licenses and notices. The running app also has a `/licenses` page with the full package notices.

This is a demo, not a live restaurant: store details are placeholders, no payment or dispatch service is connected, and orders are stored locally.

## Rights

© 2026 Baran Ahmedov. All rights reserved in this project’s original code, text, design, and logo. No permission is granted to use, copy, modify, or distribute those materials, or to use the DönerHere! name or logo, without prior written permission. Third-party components and assets remain under their own licenses; see [LICENSES.md](LICENSES.md) and the app’s `/licenses` page.
