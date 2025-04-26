// Function to create a new user
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { AuthProvider } from '@prisma/client';
import { NextResponse as res, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return res.json({ message: 'Method not allowed!' }, { status: 405 });
    }
    const { email, password, name, avatarUrl } = await req.json();

    // Form Validations
    if (!email || !password || !name) {
      return res.json({ message: 'Please fill all the fields!' }, { status: 422 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      1;
      return res.json({ message: 'User already exists!' }, { status: 409 });
    }

    // Hash Password and Create User
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatarUrl,
        provider: AuthProvider.CUSTOM,
      },
    });

    // Return success response
    return res.json({ message: 'Registration successful!' }, { status: 201 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.json(
      { message: 'Server encountered an error while processing the request! Try again later!' },
      { status: 500 }
    );
  }
}
