import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// Ensure at least one provider is configured
const providers = [];
if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
  // Debug: Log first and last few characters (don't log full secrets)
  console.log("🔐 Google OAuth configured");
  console.log("   Client ID:", env.AUTH_GOOGLE_ID.substring(0, 10) + "..." + env.AUTH_GOOGLE_ID.slice(-5));
  console.log("   Client Secret:", env.AUTH_GOOGLE_SECRET.substring(0, 5) + "..." + env.AUTH_GOOGLE_SECRET.slice(-3));
  
  providers.push(
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (providers.length === 0) {
  console.warn(
    "⚠️ Warning: No authentication providers configured. Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in your .env file."
  );
}

// NextAuth requires at least one provider
if (providers.length === 0) {
  throw new Error(
    "NextAuth configuration error: No authentication providers configured. " +
    "Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in your .env file."
  );
}

export const authConfig = {
  secret: env.AUTH_SECRET ?? "development-secret-change-in-production",
  providers,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  pages: {
    signIn: "/",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    async signIn({ account, profile }) {
      // Allow all Google accounts to sign in
      // For production, you may want to restrict to specific domains:
      // if (account?.provider === "google") {
      //   return profile!.email!.endsWith("@kmitl.ac.th");
      // }
      return true;
    },
  },
} satisfies NextAuthConfig;
