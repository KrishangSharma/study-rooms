import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { NextRequest, NextResponse as res } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: 'User not found!' }, { status: 404 });
    }

    // Get the latest OTP for the user
    const latestOtpEntry = await prisma.userOTP.findFirst({
      where: {
        userId: user.id,
        expiresAt: {
          gte: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestOtpEntry) {
      return res.json({ message: 'OTP has expired!' }, { status: 400 });
    }

    const isValid = await comparePassword(otp, latestOtpEntry.otp);

    if (!isValid) {
      return res.json({ message: 'Invalid OTP!' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete OTP after use
    await prisma.userOTP.delete({ where: { id: latestOtpEntry.id } });

    return res.json({ message: 'Account verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
