import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import PasswordResetEmail from '@/react-email/emails/password-reset-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'No account found linked to this email.' }, { status: 404 });
  }

  // Create token and expiration (e.g., 15 mins from now)
  const token = randomBytes(32).toString('hex');
  const hashedToken = await hashPassword(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Save to OTP table
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashedToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Send the reset email
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: `help.studyiovibe${process.env.RESEND_DOMAIN}`,
    to: user.email,
    subject: 'Reset your StudyioVibe account password',
    react: PasswordResetEmail({
      name: user.name!,
      email: user.email,
      token: resetLink,
    }),
  });

  return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
}
