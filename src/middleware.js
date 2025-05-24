import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  const url = req.nextUrl.clone();
  const isAuthPage =
    url.pathname === "/auth" || url.pathname.startsWith("/auth/");

  if (!isAuth && !isAuthPage) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (isAuth && isAuthPage) {
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/auth/:path*", "/account", "/account/:path*"],
};
