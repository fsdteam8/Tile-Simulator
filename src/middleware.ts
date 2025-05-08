import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token");
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard", "/admin-dashboard/:path*"],
};
