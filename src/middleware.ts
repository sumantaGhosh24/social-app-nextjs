import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";

export default async function middleware(req:NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!session && (path === "/" || path === "/notifications" || path === "/search" || path === "/discover" || path.startsWith("/profile") || path.startsWith("/post"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (session && session?.user?.role === "user" && (path === "/users")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
