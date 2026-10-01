import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { schedule as fallbackSchedule } from '../../../lib/content';

export const dynamic = 'force-dynamic';

function hasKvCredentials() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function GET() {
  if (hasKvCredentials()) {
    try {
      const storedSchedule = await kv.get('savanna:schedule');
      if (Array.isArray(storedSchedule) && storedSchedule.length > 0) {
        return NextResponse.json(storedSchedule, { headers: { 'Cache-Control': 'no-store' } });
      }
    } catch {
      // Fall back to the checked-in JSON schedule when KV is not reachable.
    }
  }

  return NextResponse.json(fallbackSchedule, { headers: { 'Cache-Control': 'no-store' } });
}
