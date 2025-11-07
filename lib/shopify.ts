import "@shopify/shopify-api/adapters/node";
import fs from "fs";
import path from "path";
import {
  DeliveryMethod,
  LATEST_API_VERSION,
  shopifyApi
} from "@shopify/shopify-api";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";

const databaseDirectory = process.env.SHOPIFY_DB_DIR || path.join(process.cwd(), "tmp");
const databasePath = process.env.SHOPIFY_DB_PATH || path.join(databaseDirectory, "shopify_sessions.sqlite");

if (!fs.existsSync(databaseDirectory)) {
  fs.mkdirSync(databaseDirectory, { recursive: true });
}

export const sessionStorage = new SQLiteSessionStorage(databasePath);

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: (process.env.SHOPIFY_API_SCOPES || "read_products,write_products").split(","),
  hostName: (process.env.SHOPIFY_APP_URL || "").replace(/^https?:\/\//, ""),
  hostScheme: process.env.SHOPIFY_APP_URL?.startsWith("https") ? "https" : "http",
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  sessionStorage
});

shopify.webhooks.addHandlers({
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (_topic, shop, body) => {
      await sessionStorage.deleteSessions(shop);
      console.info(`App uninstalled from ${shop}. Cleaned up stored sessions.`);
    }
  },
  CARTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (_topic, shop, body) => {
      console.info(`Received carts/update webhook for ${shop}: ${body}`);
    }
  }
});

export type Shopify = typeof shopify;
