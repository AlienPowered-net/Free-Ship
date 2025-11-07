import { shopifyApp } from "@shopify/shopify-app-express";
import {
  PrismaSessionStorage,
  PrismaSessionStorageOptions,
} from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";
import { prisma } from "./prisma";

const requiredVariables = [
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "SHOPIFY_APP_URL",
  "SCOPES",
  "DATABASE_URL",
];

requiredVariables.forEach((name) => {
  if (!process.env[name]) {
    console.warn(`Missing required environment variable ${name}`);
  }
});

const sessionStorageOptions: PrismaSessionStorageOptions = {
  prisma,
};

export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
    scopes: (process.env.SCOPES || "write_products,read_products").split(","),
    hostScheme: "https",
    hostName: process.env.SHOPIFY_APP_URL?.replace(/^https?:\/\//, "") || "",
    restResources,
    apiVersion: "2024-04",
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  sessionStorage: new PrismaSessionStorage(sessionStorageOptions),
  webhooks: {
    path: "/api/webhooks",
  },
});
