import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { prisma } from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // You can connect this with your DB user here
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Check if the user exists or not
          let user = await prisma.user.findUnique({ where: { email: profile.email } });
          if (user && user.provider === 'CUSTOM') {
            return '/auth/signin?error=AccountLinked';
          }

          // If New user, create account and store to DB
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                avatarUrl: profile.image,
                provider: 'GOOGLE',
              },
            });
          }
          // Create a new session
          await prisma.session.create({
            data: {
              userId: user.id,
              token: account.access_token!,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 1 month
            },
          });

          return true;
        } catch (error) {
          console.error('Error in google signin callback: ', error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin', // optional: redirect Google error back to your login
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
