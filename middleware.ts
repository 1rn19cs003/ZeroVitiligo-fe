import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BASE_URL } from "./lib/app.const";

const PROTECTED_ROUTES = [
  `/doctor`,
  `/appointments`,
  `/patients`,
  `/profile`,
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    url.pathname = `/login`;
    return NextResponse.redirect(url);
  }

  if (
    token &&
    (pathname === `/login` || pathname === `/register`)
  ) {
    url.pathname = BASE_URL;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/doctor/patients/:path*",
    "/doctor/:path*",
    "/appointments/:path*",
    "/patients/:path*",
    "/login",
    "/register",
    "/profile/:path*",
  ],
};
