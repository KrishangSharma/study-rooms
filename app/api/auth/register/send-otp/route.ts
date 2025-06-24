import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { OTPSent } from '@/react-email/emails/otp-sent';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to create an OTP
function generateOTP(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// Function to create and send an OTP
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    // Find the user
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }
    // Generate OTP, assign to user
    let otp = generateOTP();
    const hashedOTP = await hashPassword(otp);

    await prisma.userOTP.create({
      data: {
        otp: hashedOTP,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000), // OTP Expires in 3 mins
      },
    });
    // Send the unhashed OTP to the user VIA email
    await resend.emails.send({
      from: `studyiovibe.onboarding${process.env.RESEND_DOMAIN}`,
      to: email,
      subject: 'One time password for account verification',
      react: OTPSent({ otp }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.log('Error generating the OTP! Please try again later!');
    return NextResponse.json(
      { message: 'Error generating the OTP! Please try again later!' },
      { status: 500 }
    );
  }
}
