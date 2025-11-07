import { NextRequest } from "next/server";
import { sessionStorage, shopify } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CALLBACK_PATH = "/api/auth/callback";

async function beginAuth(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get("shop");
  if (!shop) {
    return new Response("Missing shop query parameter", { status: 400 });
  }

  const authBegin = await shopify.auth.oauth.begin({
    shop,
    callbackPath: CALLBACK_PATH,
    isOnline: true,
    stateContext: {
      host: request.nextUrl.searchParams.get("host") ?? undefined
    }
  });

  const redirectUrl = typeof authBegin === "string" ? authBegin : authBegin.url;

  return Response.redirect(redirectUrl, 302);
}

async function handleCallback(request: NextRequest) {
  const rawBody = await request.text();
  const callbackParams = await shopify.auth.oauth.callback({
    url: request.url,
    rawBody,
    rawRequest: {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    }
  });

  const session = "session" in callbackParams ? callbackParams.session : callbackParams;
  await sessionStorage.storeSession(session);

  const host = "state" in callbackParams && callbackParams.state?.host
    ? callbackParams.state.host
    : request.nextUrl.searchParams.get("host");
  const redirectPath = host ? `/?shop=${session.shop}&host=${encodeURIComponent(host)}` : "/";
  return Response.redirect(redirectPath, 302);
}

function isCallback(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  return pathname.endsWith("/callback");
}

export async function GET(request: NextRequest) {
  if (isCallback(request)) {
    return handleCallback(request);
  }

  return beginAuth(request);
}

export async function POST(request: NextRequest) {
  return handleCallback(request);
}
