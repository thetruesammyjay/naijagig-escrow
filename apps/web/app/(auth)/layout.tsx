import React from "react";

/**
 * Auth layout — minimal, no Navbar/Footer.
 * The root layout wraps every page with Navbar + Footer, so we use a
 * negative top margin trick on the auth pages themselves to compensate
 * for the Navbar's fixed height. This layout simply passes children
 * through so Next.js has a valid module to import.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
