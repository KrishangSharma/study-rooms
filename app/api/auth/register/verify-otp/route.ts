import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    // Get all OTP entries for the user
    const otpEntries = await prisma.userOTP.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let matchedOtpEntry = null;

    for (const entry of otpEntries) {
      const isMatch = await comparePassword(otp, entry.otp);
      if (isMatch) {
        matchedOtpEntry = entry;
        break;
      }
    }

    if (!matchedOtpEntry) {
      return NextResponse.json({ message: 'Invalid OTP!' }, { status: 401 });
    }

    // Now check expiry
    if (matchedOtpEntry.expiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP has expired!' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete OTP after use
    await prisma.userOTP.delete({ where: { id: matchedOtpEntry.id } });

    return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
