import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a valid email address.' }, { status: 400 });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase().slice(0, 254) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ error: 'Newsletter storage is not configured yet.' }, { status: 503 });
  }

  try {
    await kv.lpush('savanna:newsletter-signups', JSON.stringify({ email, createdAt: new Date().toISOString() }));
    await kv.ltrim('savanna:newsletter-signups', 0, 4_999);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'We could not save your email just now. Please try again later.' }, { status: 503 });
  }
}
