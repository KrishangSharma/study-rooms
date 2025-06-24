import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword, comparePassword } from '@/lib/password';
import PasswordReset from '@/react-email/emails/password-reset';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resetRecords = await prisma.passwordResetToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    let matchingToken = null;
    for (const record of resetRecords) {
      const isMatch = await comparePassword(token, record.tokenHash);
      if (isMatch) {
        matchingToken = record;
        break;
      }
    }

    if (!matchingToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: matchingToken.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error in password reset POST handler:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hashPassword(otp);
    // Store OTP in PasswordResetToken
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashedOTP,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
      },
    });
    // Dummy resend email function
    console.log(`[DUMMY EMAIL] Sent password reset OTP ${otp} to ${email}`);
    await resend.emails.send({
      from: `studyiovibe.help${process.env.RESEND_DOMAIN}`,
      to: email,
      subject: 'Reset your StudyioVibe account password with this OTP.',
      react: PasswordReset({ otp: otp, username: user.name! }),
    });

    return NextResponse.json({ message: 'OTP sent to email' }, { status: 200 });
  } catch (err) {
    console.error('Error in password reset PATCH handler:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
