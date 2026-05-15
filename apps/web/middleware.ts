/**
 * Next.js middleware — server-side route protection.
 *
 * Protected routes (/client/*, /freelancer/*) require an active NextAuth session.
 * Unauthenticated requests are redirected to /login with a `callbackUrl` so the
 * user is returned to their intended destination after login.
 *
 * Auth routes (/login, /register) redirect authenticated users to their dashboard.
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // If authenticated user visits auth pages, redirect to their dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      const role = token.role as string | undefined;
      const dashboardUrl =
        role === "freelancer" ? "/freelancer" : "/client";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware on routes that need protection or redirection
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Protected routes require a valid session token
        if (
          pathname.startsWith("/client") ||
          pathname.startsWith("/freelancer")
        ) {
          return !!token;
        }

        // All other routes (public + auth pages) are allowed
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Match dashboard routes and auth pages
  matcher: [
    "/client/:path*",
    "/freelancer/:path*",
    "/login",
    "/register",
  ],
};
