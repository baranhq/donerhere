# DonerHere

<p align="center">
  <img src="src/assets/logo/donerhere_logo.png" alt="DonerHere" width="420" />
</p>

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

- Menu, product photos, categories, and homepage promotions
- Accounts, persistent cart, checkout, and order history
- Staff tools for managing products, orders, users, and permissions

This is a demo, not a live restaurant: store details are placeholders, no payment or dispatch service is connected, and orders are stored locally. For deployment and configuration, see the [development guide](docs/development.md).
