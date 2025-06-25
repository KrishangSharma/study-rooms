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

    const userId = token.sub;

    const { name, email, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, image: image },
    });

    return Response.json({ message: 'Profile updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub;

    // Delete user-related records (customize as needed)
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.passwordResetToken.delete({ where: { id: userId } });
    await prisma.userOTP.delete({ where: { id: userId } });
    await prisma.user.delete({ where: { id: userId } });

    return Response.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting account:', error);
    return Response.json({ message: 'Failed to delete account' }, { status: 500 });
  }
}
