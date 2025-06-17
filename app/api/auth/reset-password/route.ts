import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/password';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  // console.log(token, newPassword);

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
    // console.log(record);
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
}
