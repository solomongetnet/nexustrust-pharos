import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";
const key = new TextEncoder().encode(secretKey);

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const decodedSession = session ? await decrypt(session) : null;
  const isAuthenticated = !!decodedSession;
  const isAdmin = decodedSession?.role === "ADMIN";

  // 1. Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    // Exclude /admin/login if it exists there, but user said /auth/login
    // Assuming /admin/**/* are all protected
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (!isAdmin) {
      // If authenticated but not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. Protect Auth Routes (Login Page)
  if (pathname.startsWith("/auth/login")) {
    if (isAuthenticated && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
