import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BASE_URL } from "./lib/app.const";

const PROTECTED_ROUTES = [
    `/doctor`,
    `/doctor/patient`,
    `/appointments`,
    `/patients`,
    `/profile`,
    `/media`,
    `/add-assistant`,
];

export function proxy(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;

    const url = req.nextUrl.clone();
    let pathname = req.nextUrl.pathname;

    // Strip basePath if present
    const basePath = '/';
    if (pathname.startsWith(basePath)) {
        pathname = pathname.slice(basePath.length) || '/';
    }

    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtected && !token) {
        url.pathname = `${basePath}/login`;
        return NextResponse.redirect(url);
    }

    if (
        token &&
        (pathname === `/login` || pathname === `/add-assistant`)
    ) {
        url.pathname = basePath + BASE_URL;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/doctor/patient/:path*",
        "/doctor/:path*",
        "/appointments/:path*",
        "/patients/:path*",
        "/login",
        "/add-assistant",
        "/profile/:path*",
        "/media/:path*"
    ],
};
