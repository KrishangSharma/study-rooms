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

    return NextResponse.json({ message: `Deleted ${deleted.count} expired OTPs` });
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
    return NextResponse.json({ message: 'Failed to clean expired OTPs' }, { status: 500 });
  }
}
