# Free-Ship

Free Shipping Progress Bar for Shopify Stores

## Development

1. Copy `.env.example` to `.env.local` (or `.env`) and fill in your Shopify app credentials.
2. Install dependencies with `npm install` (a Shopify partner account is required to download the Shopify packages).
3. Run the development server with `npm run dev`.

The embedded admin is wrapped with Polaris and App Bridge providers in `app/layout.tsx`, and authenticated fetch helpers are exposed through `useAuthenticatedFetch`.

## OAuth

OAuth is handled with Next.js route handlers under `app/api/auth/[...shopify]/route.ts` using the official `@shopify/shopify-api` helpers. The same handler supports the `auth` entry point and the `auth/callback` redirect from Shopify.

## Webhooks

Register mandatory webhooks after installation with:

```bash
npm run register:webhooks
```

This script expects `SHOPIFY_SHOP` and `SHOPIFY_ADMIN_ACCESS_TOKEN` in your environment and registers the `APP_UNINSTALLED` and `CARTS_UPDATE` webhooks to keep store data in sync.
