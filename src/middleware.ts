import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasConsent = request.cookies.has("age-consent");
  const isConsentPage = request.nextUrl.pathname === "/age-consent";

  // If user is on consent page and has consent, redirect to home
  if (isConsentPage && hasConsent) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user doesn't have consent and isn't on consent page, redirect to consent page
  if (!hasConsent && !isConsentPage) {
    const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/age-consent?returnUrl=${returnUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 