import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CANONICAL_HOST, SITE_ORIGIN } from "@/lib/site";

const REDIRECT_HOSTS = new Set([
  "www.aldetali.ru",
  "aldetali.com",
  "www.aldetali.com",
]);

function requestHost(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

function requestProto(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  return raw.split(",")[0]?.trim().toLowerCase() ?? "https";
}

export function middleware(request: NextRequest) {
  const host = requestHost(request);
  const proto = requestProto(request);
  const hostNeedsRedirect = REDIRECT_HOSTS.has(host);
  const httpNeedsRedirect = host === CANONICAL_HOST && proto === "http";

  if (!hostNeedsRedirect && !httpNeedsRedirect) {
    return NextResponse.next();
  }

  const dest = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    SITE_ORIGIN
  );
  return NextResponse.redirect(dest, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
