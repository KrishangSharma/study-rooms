import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    const deleted = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return NextResponse.json({ message: `Deleted ${deleted.count} expired sessions` });
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
    return NextResponse.json({ message: 'Failed to clean expired sessions' }, { status: 500 });
  }
}
