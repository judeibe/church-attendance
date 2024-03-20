import { env } from "@/env";
import { prisma } from "@lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type AuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER,
        port: env.EMAIL_PORT,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      if (user.email) {
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (userExists) {
          return true;
        }
      }
      return "/register";
    },
  },
} satisfies AuthOptions;

export const getServerAuthSession = () => getServerSession(authOptions);
