import { prisma } from './prisma';
import { NextAuthOptions } from 'next-auth';
import { comparePassword } from './password';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // @ts-expect-error This is a temporary workaround for a type mismatch
  // between the adapter from `@auth/prisma-adapter` and the `next-auth` v4 types.
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials!');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { accounts: true },
        });
        if (!user) {
          throw new Error('User not found! Please create an account.');
        }

        const hasGoogleAccount = user.accounts.some((account) => account.provider === 'google');
        if (hasGoogleAccount) {
          throw new Error(
            'This account is linked with Google. Please login via Google to proceed.'
          );
        }

        if (!user.password) {
          throw new Error('Please login using the method you originally signed up with.');
        }

        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password!');
        }
        return {
          id: user.id,
          name: user.name || undefined,
          email: user.email,
          image: user.image || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user, email }) {
      // Do not allow google login with credentials email
      if (account?.provider === 'google') {
        const user = await prisma.user.findUnique({
          where: {
            email: profile?.email,
          },
          include: { accounts: true },
        });
        const hasGoogleAccount = user?.accounts.some((acc) => acc.provider === 'google');
        if (!hasGoogleAccount) {
          // Block login or prompt to link
          return '/auth/login?error=AccountLinked';
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.userId = token.sub as string;
        const user = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: {
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            accounts: { select: { provider: true } },
            password: true,
          },
        });
        if (user) {
          session.user.name = user.name || undefined;
          session.user.email = user.email;
          session.user.image = user.image || undefined;
          session.user.isEmailVerified = !!user.emailVerified;
          if (user.accounts.length > 0) {
            session.user.provider = user.accounts[0].provider;
          } else if (user.password) {
            session.user.provider = 'credentials';
          } else {
            session.user.provider = undefined;
          }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
