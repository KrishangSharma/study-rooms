import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse as Response } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    // Get user details from the session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return Response.json({
        message: 'No active sessions found! Please login before trying again.',
      });
    }

    //! Ye ID jo mil rhi hai, ye next-auth ki ID hai.. Apne ko, google login/creation ke callback mei, next-auth ki ID ki jagah, db ki id daalni hai, tabhi yaha updation hogi!!
    const userId = token.sub;
    console.log('Recieved User ID: ', userId);

    const { name, email, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, avatarUrl: image },
    });

    return Response.json({ message: 'Profile updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
