"use client";
/**
 * useAuth — thin wrapper around NextAuth useSession().
 * Exposes the user object, role, and auth state in a consistent shape
 * that matches the rest of the app's User type.
 */
import { useSession, signOut } from "next-auth/react";
import type { UserRole } from "../types/user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user: AuthUser | null =
    session?.user
      ? {
          id: (session.user as any).id as string,
          email: session.user.email ?? "",
          name: session.user.name ?? "",
          role: (session.user as any).role as UserRole,
        }
      : null;

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return { user, isAuthenticated, isLoading, logout };
}
