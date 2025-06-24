import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/password';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Get all valid (not used, not expired) PasswordResetToken entries for the user
    const resetTokens = await prisma.passwordResetToken.findMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    let matchedToken = null;
    for (const tokenEntry of resetTokens) {
      const isMatch = await comparePassword(otp, tokenEntry.tokenHash);
      if (isMatch) {
        matchedToken = tokenEntry;
        break;
      }
    }
    if (!matchedToken) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }
    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: matchedToken.id },
      data: { used: true },
    });
    // Update password
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error in verify-otp POST handler:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
