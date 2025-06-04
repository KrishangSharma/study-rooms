// app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Optionally add headers like User-Agent, etc.
      },
    });

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
