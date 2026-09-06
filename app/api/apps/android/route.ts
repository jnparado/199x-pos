import { NextResponse } from "next/server";

export function GET(request: Request) {
  const download = new URL("/download#android", request.url);
  return NextResponse.redirect(download);
}
