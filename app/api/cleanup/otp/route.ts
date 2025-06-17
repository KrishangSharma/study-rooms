import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    const deleted = await prisma.userOTP.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    const passwordTokens = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // expired
          { used: true }, // already used
        ],
      },
    });

    return NextResponse.json({
      message: `Deleted ${deleted.count} expired OTPs and ${passwordTokens.count} expired password tokens!`,
    });
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
    return NextResponse.json({ message: 'Failed to clean expired OTPs' }, { status: 500 });
  }
}
