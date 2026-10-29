# Development guide

## Configuration

See `.env.example`. Environment variables are loaded from `.env` by the development, production, and employee commands.

| Variable         | Purpose                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| `APP_ORIGIN`     | Exact public origin; defaults to `http://localhost:5173`. Production must use HTTPS.                     |
| `API_PORT`       | Backend port, default `3001`.                                                                            |
| `DB_PATH`        | SQLite file, default `data/store.sqlite`. Back up this private directory and restrict filesystem access. |
| `UPLOAD_DIR`     | Uploaded catalog images, default `data/uploads`. Back up and keep this directory outside Git.            |
| `SESSION_SECRET` | At least 32 random characters in production. Development uses a generated database-local secret.         |
| `NODE_ENV`       | `production` enables Secure cookies, HTTPS origin enforcement and security headers.                      |

The API binds to `127.0.0.1`. Production requires a trusted HTTPS reverse proxy on the same host that replaces `X-Forwarded-Proto` with `https`. Do not expose the backend directly or trust client-supplied forwarding headers. Authentication throttling currently uses the loopback peer IP plus email; the peer-IP limit is shared by proxied clients.

```bash
npm run build
# Set APP_ORIGIN=https://your-domain.example and SESSION_SECRET in .env first
npm start
```

The production Node server serves `dist` and `/api` together. Static-only hosting cannot run these account, admin, or order APIs. `npm run preview` previews only Vite's built static files; use `npm start` for a complete production smoke test.

## Development and checks

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run licenses
npm run storybook
npm run test:stories
npm run build-storybook
```

API tests use temporary SQLite databases and cover authentication, password confirmation, role enforcement, CSRF protection, session expiry/revocation, validation, throttling, catalog changes, totals, order visibility and idempotency. Story tests require Playwright Chromium installed (`npx playwright install chromium`). ESLint and Prettier configuration is included. Build products, private databases, `.env` secrets, and generated license reports are ignored by Git.

## Project structure

- `src/pages` and `src/components`: storefront, account, cart, checkout and employee UI.
- `src/store`: shared catalog/session state, API access and persistent cart.
- `server`: SQLite schema, seeded catalog, server-side account/catalog/order APIs and session store.
- `scripts`: development launcher, trusted staff-role commands and license inventory.
- `tests`: isolated API integration tests.
- `docs/licenses`: required source notices retained when packages omit them.
- `public/products`: stable URLs for the existing product images.

## Security review

Before every commit, inspect staged filenames and diffs and run `gitleaks git --staged --redact` (or `gitleaks git --log-opts="--cached" --redact` on versions without --staged). Before pushing, scan all history with `gitleaks git --log-opts="--all" --redact`. Never commit `.env`, account data, session secrets, or SQLite files. No VITE_ secret variables are used. Database migrations are versioned through PRAGMA user_version, run transactionally on startup, and must be appended rather than changed after deployment.
