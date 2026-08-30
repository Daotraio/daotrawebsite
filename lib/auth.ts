import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation/auth";

// This is intentionally a stub: there is no database wired into this codebase
// (see .env.example - DATABASE_URL is unset). Swap findUserByEmail for a real
// query (Prisma, Drizzle, etc.) once you've picked a provider. The shape
// below (id/email/name/role) is what the rest of the app - dashboard route
// guards, nav, etc. - expects back on the session.
async function findUserByEmail(_email: string): Promise<{
  id: string;
  email: string;
  name: string;
  role: "publisher" | "advertiser";
  passwordHash: string;
} | null> {
  return null;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await findUserByEmail(parsed.data.email);
        if (!user) return null;

        const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!validPassword) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: "publisher" | "advertiser" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
