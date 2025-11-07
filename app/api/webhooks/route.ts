import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Webhook handler not yet implemented" },
    { status: 501 }
  );
}
