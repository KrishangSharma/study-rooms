import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get('room');
    const username = req.nextUrl.searchParams.get('username');

    if (!room) {
      return NextResponse.json({ error: 'Missing "room" query parameter!' }, { status: 400 });
    } else if (!username) {
      return NextResponse.json({ error: 'Missing "username" query parameter!' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: 'Problem in server config!' }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return NextResponse.json(
      { token: await at.toJwt() },
      { headers: { 'Cache-control': 'no-store' } }
    );
  } catch (err) {
    console.log('Error while creating room: ', err);
    return NextResponse.json(
      { error: 'Cannot create a room right now! Please try again later.' },
      { status: 500 }
    );
  }
}
