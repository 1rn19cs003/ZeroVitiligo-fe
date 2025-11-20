import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes
const PROTECTED_ROUTES = [
  "/doctor",
  // "/dashboard",
  "/appointments",
  "/patients",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // read from cookie

  const url = req.nextUrl.clone();
  const { pathname } = url;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If route is protected and no token → redirect to login
  if (isProtected && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to visit login/signup → redirect home
  if (token && (pathname === "/login" || pathname === "/register")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
  matcher: [
    "/doctor/:path*",
    "/dashboard/:path*",
    "/login",
    "/register"],
};
