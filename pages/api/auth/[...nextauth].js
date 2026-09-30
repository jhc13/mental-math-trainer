import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prisma from 'prisma/prisma';
import { MAX_DISPLAY_NAME_LENGTH } from 'utils/config';
import sendSignInLinkEmail from 'utils/email';

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendSignInLinkEmail
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/'
  },
  callbacks: {
    async jwt({ token, user, isNewUser }) {
      if (user) {
        token.userId = user.id;
        if (isNewUser) {
          // Set the initial display name.
          let displayName =
            user.name || user.email.slice(0, user.email.lastIndexOf('@'));
          displayName = displayName.slice(0, MAX_DISPLAY_NAME_LENGTH);
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              displayName
            }
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      const { userId } = token;
      session.user.id = userId;
      return session;
    }
  },
  adapter: PrismaAdapter(prisma)
};

export default NextAuth(authOptions);
