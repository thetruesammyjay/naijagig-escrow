"use client";
/**
 * Providers — wraps the app with NextAuth SessionProvider and ToastProvider.
 * Must be a client component since SessionProvider uses React context.
 */
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
