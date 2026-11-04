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
- Product/category management, searchable product rows, image uploads, size prices, availability, product SEO fields and editable homepage promotions.
- Admin-only order analytics, users, custom staff permissions and reusable permission templates.
- Contact/feedback forms with a permission-protected inbox; draft-and-publish editors for owner-supplied Terms and Privacy text.
- Tailwind layouts, mobile navigation, account settings, separate order history, quick-add size selection and license accordions.

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

Storybook: `npm run storybook`. Story tests: `npm run test:stories` (requires Playwright Firefox).

## Used Apps / Technologies

[Open the full technology inventory](docs/technologies.md) for the stack, direct dependencies, versions, and licenses. See [LICENSES.md](LICENSES.md) and the website’s `/licenses` page for dependency licenses and notices.

## Image sources

Some product photos were improved with AI. The specific files and AI tool are unknown.

| Image files | Source and credit |
| --- | --- |
| `src/assets/products/ayran.png`<br>`public/products/ayran.png` | [Canva photo: Traditional Turkish Lahmacun with Salad and Ayran](https://www.canva.com/photos/MAGqX9EGBms-traditional-turkish-lahmacun-with-salad-and-ayran/)<br>Pexels source, Cihan Çimen |
| `src/assets/products/doner-wrap2.png`<br>`public/products/doner-wrap2.png`<br>`src/assets/promotions/promotion.png`<br>`public/promotions/promotion.png` | [Canva photo: Shawarma Wrapped on Checkered Wax Paper](https://www.canva.com/photos/MAEtht6AT0o-shawarma-wrapped-on-checkered-wax-paper/)<br>Pexels source, Karen Laårk Boshoff |
| `src/assets/products/fries.png`<br>`public/products/fries.png`<br>`src/assets/promotions/promotion2.png`<br>`public/promotions/promotion2.png` | [Canva photo: Golden Crinkle Cut French Fries with Ketchup](https://www.canva.com/photos/MAGcthNOnQo-golden-crinkle-cut-french-fries-with-ketchup/)<br>Aflo Images source |
| `src/assets/products/baklava.png`<br>`public/products/baklava.png` | [Unsplash photo](https://unsplash.com/photos/brown-bread-with-green-vegetable-on-white-ceramic-plate-Z8nrygSBcLE)<br>Ömer Haktan Bulut |
| `src/assets/products/doner-wrap.png`<br>`public/products/doner-wrap.png` | [Unsplash photo](https://unsplash.com/photos/a-pita-sandwich-on-a-plate-with-a-small-bowl-of-ranch-dressing-e8F2zJzJxkI)<br>Orkun Orcan |
| `src/assets/logo/donerhere_logo.png` | Created by the project owner |

## Rights

© 2026 Baran Ahmedov. All rights reserved in the original code, text, visual design, and logo created for this project. This claim excludes product photos and other third-party imagery; those remain under their respective licenses and terms. See the image sources table above, [LICENSES.md](LICENSES.md), and the app’s `/licenses` page. No permission is granted to use, copy, modify, or distribute the original project materials, or to use the DönerHere! name or logo, without prior written permission.
