# ShopLedger working notes

## Stack

- Node.js and CommonJS modules
- Express 4 serves `public/` and JSON APIs
- `data/db.json` is the tracked JSON data store
- Tests use the built-in `node:test` runner

## Module map

- `server.js` wires Express, static assets, API routers, and invoice HTML.
- `routes/` exposes product, order, customer, and report endpoints.
- `lib/pricing.js`, `lib/tax.js`, and `lib/coupons.js` calculate cart totals.
- `lib/invoice.js` calculates and renders printable tax invoices.
- `lib/inventory.js`, `lib/orders.js`, and `lib/ledger.js` handle stock, orders, and Khata.
- `lib/store.js` reads and writes `data/db.json`.
- `config.js` holds shop, tax, inventory, and coupon configuration.

## Commands

- `npm start` starts the app on port 3000.
- `node --test` runs characterization and regression tests.

## Rules

- Write characterization tests before changing behavior.
- Change only the module the ticket is about.
- Tests must never touch `data/db.json`.
- Add no dependencies.
- Do not commit `package-lock.json`.
