import { prisma } from './prisma';
import { NextAuthOptions } from 'next-auth';
import { comparePassword } from './password';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
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
        });
        if (!user) {
          throw new Error('User not found! Please create an account.');
        }
        if (user.provider === 'GOOGLE') {
          throw new Error(
            'This account is linked with Google. Please login via Google to proceed.'
          );
        }
        const isValid = await comparePassword(credentials.password, user.password!);
        if (!isValid) {
          throw new Error('Incorrect password!');
        }
        return {
          id: user.id,
          name: user.name || undefined,
          email: user.email,
          image: user.avatarUrl || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') return true;
      if (account?.provider === 'google' && profile?.email) {
        try {
          let user = await prisma.user.findUnique({ where: { email: profile.email } });
          if (user && user.provider === 'CUSTOM') {
            return '/auth/signin?error=AccountLinked';
          }
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                avatarUrl: profile.image,
                isVerified: true,
                provider: 'GOOGLE',
              },
            });
          }
          return true;
        } catch (error) {
          console.error('Error in google signin callback: ', error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.userId = token.sub as string;
        const user = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { name: true, email: true, avatarUrl: true },
        });
        if (user) {
          session.user.name = user.name || undefined;
          session.user.email = user.email;
          session.user.image = user.avatarUrl || undefined;
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
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
