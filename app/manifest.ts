import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Savanna FM 98.4',
    short_name: 'Savanna FM',
    description: 'The heartbeat of East Africa. Live from Nairobi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f5ed',
    theme_color: '#21634f',
    orientation: 'portrait-primary',
    lang: 'en-KE',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
