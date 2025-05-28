import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  const isAuth = !!token;
  const isAuthPage =
    url.pathname === "/auth" || url.pathname.startsWith("/auth/");

  const userRole = token?.role;
  const headQuarter = userRole === "admin" || userRole === "manager";

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!isAuth && !isAuthPage) {
    const redirect = encodeURIComponent(req.nextUrl.pathname);
    url.pathname = "/auth/login";
    url.search = `?redirect=${redirect}`;
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users away from login page
  if (isAuth && isAuthPage) {
    const callback = req.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(callback, req.url));
  }

  // 3. Block non-admins from accessing /dashboard
  if (url.pathname.startsWith("/dashboard") && !headQuarter) {
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  // 4. Redirect authenticated admin & manager to /dashboard
  if (url.pathname.startsWith("/account") && headQuarter) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth",
    "/auth/:path*",
    "/account",
    "/account/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
