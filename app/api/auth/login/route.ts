// Function to create a new user
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { comparePassword } from '@/lib/password';
import { NextResponse as res, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return res.json({ message: 'Method not allowed!' }, { status: 405 });
    }
    const { email, password } = await req.json();

    // Form Validations
    if (!email || !password) {
      return res.json({ message: 'Please provide all credentials!' }, { status: 422 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser || !existingUser.password) {
      return res.json({ message: 'User not found. Please create an account!' }, { status: 404 });
    }

    // Compare Password
    const passwordMatch = await comparePassword(password, existingUser.password);
    if (!passwordMatch) {
      return res.json({ message: 'Invalid credentials!' }, { status: 401 });
    }

    // Return success response
    const sessionToken = crypto.randomUUID();

    // Save session in DB
    await prisma.session.create({
      data: {
        userId: existingUser.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 1 month
      },
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // expires in 1 month
      path: '/',
      sameSite: 'lax',
    });

    const { password: _, ...safeUser } = existingUser;

    return res.json({ message: 'Logged in successfully!', user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Error while Logging in:', error);
    return res.json(
      { message: 'Server encountered an error while processing the request! Try again later!' },
      { status: 500 }
    );
  }
}
