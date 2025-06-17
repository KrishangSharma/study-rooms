// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/verify', 'auth/forget-password'];
const AUTH_ROUTES = ['/user/account'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from public auth pages
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Block non-authenticated users from private pages
  if (!token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next(); // Allow the request to continue
}

export const config = {
  matcher: ['/', '/auth/:path*', '/user/:path*'],
};
