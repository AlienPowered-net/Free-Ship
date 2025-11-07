import "dotenv/config";
import { DeliveryMethod } from "@shopify/shopify-api";
import { shopify } from "@/lib/shopify";

async function main() {
  const shop = process.env.SHOPIFY_SHOP;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shop) {
    throw new Error("SHOPIFY_SHOP is required to register webhooks");
  }
  if (!accessToken) {
    throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is required to register webhooks");
  }

  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;

  const results = await shopify.webhooks.register({
    session,
    addHandlers: {
      APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks"
      },
      CARTS_UPDATE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks"
      }
    }
  });

  Object.entries(results).forEach(([topic, result]) => {
    if (!result.success) {
      console.error(`Failed to register ${topic}:`, result.result);
    } else {
      console.log(`Registered webhook for ${topic}`);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
