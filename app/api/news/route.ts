import { NextResponse } from 'next/server';
import { news as fallbackNews } from '../../../lib/content';

export const revalidate = 120;

export async function GET() {
  const feedUrl = process.env.NEWS_FEED_URL;
  if (feedUrl) {
    try {
      const response = await fetch(feedUrl, { next: { revalidate: 120 } });
      if (response.ok) {
        const payload = await response.json();
        const articles = Array.isArray(payload) ? payload : payload.articles;
        if (Array.isArray(articles)) return NextResponse.json(articles);
      }
    } catch {
      // The editorial sample set is intentionally available when no CMS is connected.
    }
  }
  return NextResponse.json(fallbackNews);
}
