import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "saudi_vision_secret_key_12345" });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth/signin");

    // 1. If User is Logged In AND tries to go to Sign In page -> Redirect to Home
    if (isAuthPage && isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. If User is NOT Logged In AND tries to access protected routes -> Redirect to Sign In
    // (Add any other protected routes here if needed in future)
    // 2. If User is NOT Logged In AND tries to access protected routes -> Redirect to Sign In
    if (!isAuth && (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/settings"))) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/signin", "/profile/:path*", "/settings/:path*", "/chat/:path*"],
};
