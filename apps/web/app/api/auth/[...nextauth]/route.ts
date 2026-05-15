/**
 * NextAuth route handler — wired to the FastAPI auth backend.
 *
 * Flow:
 * 1. User submits credentials → NextAuth calls authorize()
 * 2. authorize() calls FastAPI POST /auth/login
 * 3. FastAPI returns { access_token, refresh_token, user }
 * 4. Tokens + role are stored in the JWT (server-side, httpOnly cookie)
 * 5. The session exposes role and user info to the client
 *
 * SECURITY NOTES:
 * - NEXTAUTH_SECRET must be set in env — no fallback allowed
 * - access_token is stored in the JWT and injected per-request in lib/api.ts
 * - refresh logic should be added in the jwt callback for production
 */
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          // FastAPI returns camelCase properties due to our schema updates
          const { accessToken, refreshToken, user } = data;

          if (!user || !accessToken) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
        } catch (err) {
          console.error("[NextAuth] authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, persist tokens and role from the user object
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.userId = user.id;
      }

      // TODO: add token refresh logic here when access_token expires
      // Check token.exp and call /auth/refresh with token.refreshToken

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      // Expose accessToken so lib/api.ts can inject it
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days — matches refresh token lifetime
  },

  // NEXTAUTH_SECRET is required — no fallback. Set it in .env.local
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
