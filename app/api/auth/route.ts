import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Shopify OAuth endpoints are not yet implemented. Wire them up using the lib/shopify.ts helper.",
    },
    { status: 501 }
  );
}
