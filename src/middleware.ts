import { getSessionCookie } from "better-auth/cookies";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
// 	const sessionCookie = getSessionCookie(request);

// 	if (!sessionCookie) {
// 		return NextResponse.redirect(new URL("/", request.url));
// 	}

// 	return NextResponse.next();
// }

// export const config = {
// 	matcher: ["/dashboard"],
// };

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Define route patterns
  const isAuthPage = pathname.startsWith("/login");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");
  const isPublicApiRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/api/public");

  // Allow public API routes
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes - require authentication
  if (isDashboardPage) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect admin routes - require admin role
  if (isAdminPage) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = session.user.role || "Participant";

    if (userRole !== "ADMIN" && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
