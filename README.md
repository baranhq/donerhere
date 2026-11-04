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
