import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";

export default async function middleware(req:NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!session && (path === "/" || path === "/audios" || path === "/videos" || path === "/notifications" || path === "/search" || path === "/discover" || path === "/discover-audios" || path === "/discover-videos" || path === "/users" || path === "/cart" || path === "/reviews/my" || path === "/orders/my" || path === "/categories" || path === "/categories/create" || path === "/shop" || path === "/products" || path === "/products/create" || path === "/reviews" || path === "/orders" || path.startsWith("/profile") || path.startsWith("/post") || path.startsWith("/audio") || path.startsWith("video") || path.startsWith("/categories/update") || path.startsWith("/products/update") || path.startsWith("/reviews/product") || path.startsWith("/reviews/user") || path.startsWith("/orders/user") || path.startsWith("/product/details"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (session && session?.user?.role === "user" && (path === "/users" || path === "/categories" || path === "/categories/create" || path === "/products" || path === "/products/create" || path === "/reviews" || path === "/orders" || path.startsWith("/categories/update") || path.startsWith("/products/update") || path.startsWith("/reviews/product") || path.startsWith("/reviews/user") || path.startsWith("/orders/user"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
