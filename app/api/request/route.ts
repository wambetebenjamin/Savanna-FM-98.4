import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const MAX_FIELD_LENGTH = 180;

function clean(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function hasKvCredentials() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function sendWhatsAppNotification(message: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = (process.env.WHATSAPP_RECIPIENT || '254112272061').replace(/\D/g, '');
  if (!accessToken || !phoneNumberId || !recipient) return false;

  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v22.0';
  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: { preview_url: false, body: message },
    }),
    signal: AbortSignal.timeout(8_000),
  });
  return response.ok;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a valid song request.' }, { status: 400 });
  }

  const song = clean(payload.song, 120);
  const artist = clean(payload.artist, 100);
  const name = clean(payload.name, 80);
  const dedication = clean(payload.dedication, 180);
  if (!song) return NextResponse.json({ error: 'A song title is required.' }, { status: 400 });

  const record = {
    id: crypto.randomUUID(),
    song,
    artist,
    name,
    dedication,
    createdAt: new Date().toISOString(),
    source: 'website',
  };

  if (!hasKvCredentials()) {
    return NextResponse.json({
      error: 'Song request storage is not configured. Send this request directly in WhatsApp.',
      whatsappUrl: `https://wa.me/254112272061?text=${encodeURIComponent(`Hello! I'd like to request ${song}${artist ? ` by ${artist}` : ''} on Savanna FM 98.4.${name ? ` This is ${name}.` : ''}${dedication ? ` Dedication: ${dedication}` : ''}`)}`,
    }, { status: 503 });
  }

  try {
    const serialized = JSON.stringify(record);
    await kv.lpush('savanna:song-requests', serialized);
    await kv.ltrim('savanna:song-requests', 0, 499);
  } catch {
    return NextResponse.json({
      error: 'The request could not be saved just now. Send it to the studio in WhatsApp instead.',
      whatsappUrl: `https://wa.me/254112272061?text=${encodeURIComponent(`Hello! I'd like to request ${song}${artist ? ` by ${artist}` : ''} on Savanna FM 98.4.`)}`,
    }, { status: 503 });
  }

  const notification = [
    '🎵 Savanna FM song request',
    `Song: ${song}${artist ? ` by ${artist}` : ''}`,
    name ? `From: ${name}` : '',
    dedication ? `Dedication: ${dedication}` : '',
  ].filter(Boolean).join('\n');
  let whatsappSent = false;
  try {
    whatsappSent = await sendWhatsAppNotification(notification);
  } catch {
    // The saved request remains available to the team; the client can open a wa.me hand-off.
  }

  return NextResponse.json({ ok: true, saved: true, whatsappSent, id: record.id }, { status: 201 });
}
