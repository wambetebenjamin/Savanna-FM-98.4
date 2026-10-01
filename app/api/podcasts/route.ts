import { NextResponse } from 'next/server';
import { podcasts } from '../../../lib/content';

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(podcasts);
}
