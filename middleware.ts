import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE, DRIVER_COOKIE, CUSTOMER_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/driver") && !pathname.startsWith("/driver/login")) {
    const token = req.cookies.get(DRIVER_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session || session.role !== "driver") {
      return NextResponse.redirect(new URL("/driver/login", req.url));
    }
  }

  if (pathname.startsWith("/account")) {
    const token = req.cookies.get(CUSTOMER_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session || session.role !== "customer") {
      return NextResponse.redirect(new URL("/login?next=/account", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/account/:path*"],
};
