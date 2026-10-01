import { NextResponse } from 'next/server';
import { defaultNowPlaying } from '../../../lib/content';

export const dynamic = 'force-dynamic';

function icecastStatusUrl(streamUrl: string) {
  try {
    const url = new URL(streamUrl);
    const basePath = url.pathname.replace(/\/+$/, '').replace(/\/[^/]*$/, '');
    url.pathname = `${basePath}/status-json.xsl`;
    url.search = '';
    return url.toString();
  } catch {
    return '';
  }
}

function extractSource(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;
  const current = (data.nowPlaying || data.now_playing || data.currentSong || data.current_song || data) as unknown;
  if (!current || typeof current !== 'object') return null;
  const source = current as Record<string, unknown>;
  const stats = (source.icestats || source.stats) as Record<string, unknown> | undefined;
  const streamSource = stats?.source ?? source.source;
  if (Array.isArray(streamSource)) return (streamSource[0] as Record<string, unknown>) || source;
  if (streamSource && typeof streamSource === 'object') return streamSource as Record<string, unknown>;
  return source;
}

function splitTrack(raw: string) {
  const parts = raw.split(' - ');
  return parts.length > 1
    ? { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() }
    : { artist: 'Savanna Selecta', title: raw.trim() };
}

export async function GET() {
  const streamUrl = process.env.STREAM_URL || process.env.NEXT_PUBLIC_STREAM_URL || '';
  const metadataUrl = process.env.STREAM_METADATA_URL || (streamUrl ? icecastStatusUrl(streamUrl) : '');

  if (metadataUrl) {
    try {
      const response = await fetch(metadataUrl, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4_500),
      });
      if (response.ok) {
        const payload = await response.json();
        const source = extractSource(payload);
        const rawTitle = [source?.title, source?.songtitle, source?.song_title, source?.streamTitle, source?.nowPlaying, source?.track]
          .find((value) => typeof value === 'string' && value.trim()) as string | undefined;
        if (rawTitle) {
          const parts = splitTrack(rawTitle);
          const presenter = typeof source?.presenter === 'string' ? source.presenter : defaultNowPlaying.presenter;
          const show = typeof source?.show === 'string' ? source.show : defaultNowPlaying.show;
          return NextResponse.json({
            ...defaultNowPlaying,
            title: typeof source?.track === 'string' ? source.track : parts.title,
            artist: typeof source?.artist === 'string' ? source.artist : parts.artist,
            show,
            presenter,
            source: 'stream',
          }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
        }
      }
    } catch {
      // Keep the station card informative while an encoder or metadata endpoint is unavailable.
    }
  }

  return NextResponse.json(defaultNowPlaying, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
