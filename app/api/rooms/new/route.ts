import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

function generateSegment(length = 3) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRoomName() {
  return `sv-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomName = generateRoomName();

    const newRoom = await prisma.room.create({
      data: {
        name: roomName,
        createdBy: token.sub,
      },
    });

    return NextResponse.json({ room: newRoom }, { status: 201 });
  } catch (error) {
    console.error('[CREATE_ROOM_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
