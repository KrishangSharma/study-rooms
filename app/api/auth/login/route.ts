// Function to create a new user
import { prisma } from '@/lib/prisma';
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
      return res.json({ message: 'User not found! Please create an account!!' }, { status: 404 });
    }

    // Compare Password
    const hashedPassword = await comparePassword(password, existingUser.password);
    if (!hashedPassword) {
      return res.json({ message: 'Invalid credentials!' }, { status: 401 });
    }

    // Return success response
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.json(
      { message: 'Server encountered an error while processing the request! Try again later!' },
      { status: 500 }
    );
  }
}
