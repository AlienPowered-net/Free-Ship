"use client";

import { AppProvider as PolarisProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  AppBridgeProvider,
  useAppBridge
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { ReactNode, createContext, useContext, useMemo } from "react";

export const AuthenticatedFetchContext = createContext<typeof fetch | null>(null);

export const useAuthenticatedFetch = () => {
  const fetcher = useContext(AuthenticatedFetchContext);
  if (!fetcher) {
    throw new Error("useAuthenticatedFetch must be used within ShopifyAppProviders");
  }
  return fetcher;
};

function AuthenticatedFetchProvider({ children }: { children: ReactNode }) {
  const appBridge = useAppBridge();
  const fetchFunction = useMemo(() => authenticatedFetch(appBridge), [appBridge]);

  return (
    <AuthenticatedFetchContext.Provider value={fetchFunction}>
      {children}
    </AuthenticatedFetchContext.Provider>
  );
}

function ShopifyProviderBridge({ children }: { children: ReactNode }) {
  const host = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("host") ?? "";

  return (
    <AppBridgeProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || "",
        host,
        forceRedirect: true
      }}
    >
      <AuthenticatedFetchProvider>{children}</AuthenticatedFetchProvider>
    </AppBridgeProvider>
  );
}

export function ShopifyAppProviders({ children }: { children: ReactNode }) {
  return (
    <PolarisProvider i18n={enTranslations}>
      <ShopifyProviderBridge>{children}</ShopifyProviderBridge>
    </PolarisProvider>
  );
}
