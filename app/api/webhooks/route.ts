import { NextRequest } from "next/server";
import { shopify } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const rawHeaders = Object.fromEntries(request.headers.entries());

  const adapterResponse = {
    statusCode: 200,
    statusMessage: "OK",
    headers: new Headers(),
    setHeader: (key: string, value: string) => {
      adapterResponse.headers.set(key, value);
    },
    writeHead: (status: number, statusText?: string) => {
      adapterResponse.statusCode = status;
      if (statusText) {
        adapterResponse.statusMessage = statusText;
      }
    },
    end: () => undefined
  } as unknown as import("http").ServerResponse;

  try {
    const response = await shopify.webhooks.process({
      rawBody,
      rawRequest: {
        method: request.method,
        url: request.url,
        headers: rawHeaders
      },
      rawResponse: adapterResponse
    });

    if (!response.ok) {
      return new Response("Webhook processing failed", { status: 401 });
    }
  } catch (error) {
    console.error("Error handling webhook", error);
    return new Response("Webhook processing failed", { status: 500 });
  }

  return new Response(undefined, { status: adapterResponse.statusCode });
}
