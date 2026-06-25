import { NextRequest, NextResponse } from 'next/server';
import { logVisit } from '@/lib/visit-logger';

export async function POST(req: NextRequest) {
  try {
    const { path: pathName, visitorId, userAgent } = await req.json();
    logVisit(pathName || '/', visitorId || 'anonymous', userAgent || '');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
