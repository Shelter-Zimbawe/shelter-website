import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/adminAuth";

function isProtectedApiRoute(pathname: string, method: string) {
  if (pathname === "/api/bookings" && method === "GET") return true;
  if (pathname.startsWith("/api/bookings/") && (method === "PUT" || method === "DELETE")) return true;
  if (pathname === "/api/stands" && method === "POST") return true;
  if (pathname.startsWith("/api/stands/") && (method === "PUT" || method === "DELETE")) return true;
  if (pathname === "/api/superstructures" && method === "POST") return true;
  if (pathname.startsWith("/api/superstructures/") && (method === "PUT" || method === "DELETE")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginPage = pathname === "/admin/login";
  const protectedApi = isProtectedApiRoute(pathname, request.method);

  if (!isAdminPage && !protectedApi) {
    return NextResponse.next();
  }

  if (hasAdminSession(request)) {
    if (isAdminLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminLoginPage) {
    return NextResponse.next();
  }

  if (protectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
