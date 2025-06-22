// Function to create a new user
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed!' }, { status: 405 });
    }
    //TODO: Move avtar url to profile mgmt
    const { email, password, name } = await req.json();

    // Form Validations
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Please fill all the fields!' }, { status: 422 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      1;
      return NextResponse.json({ message: 'User already exists!' }, { status: 409 });
    }

    // Hash Password and Create User
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: 'Account created successfully!!', user: email },
      { status: 201 }
    );
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { message: 'Server encountered an error while processing the request! Try again later!' },
      { status: 500 }
    );
  }
}
