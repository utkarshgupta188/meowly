import { NextResponse } from 'next/server';
import { logErrorServer, getRecentErrors } from '@/lib/logger-server';

export async function POST(req: Request) {
  try {
    const error = await req.json();
    logErrorServer(error);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const errors = getRecentErrors();
    return NextResponse.json(errors);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
