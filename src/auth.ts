import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role ?? "admin";
        // Ensure email persists across refreshes
        if (user.email) token.email = user.email;
        if (user.name) token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      // Explicitly map all token fields onto session.user
      session.user = {
        ...session.user,
        id: token.id as string,
        name: (token.name as string | null) ?? session.user?.name ?? null,
        email: (token.email as string | null) ?? session.user?.email ?? null,
        role: token.role as string,
      } as typeof session.user;
      return session;
    },
  },
  session: { strategy: "jwt" },
});
