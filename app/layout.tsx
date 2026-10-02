import type { Metadata, Viewport } from 'next';
import { podcasts } from '../lib/content';
import ServiceWorkerRegistration from '../components/service-worker-registration';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savannafm.co.ke';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Savanna FM 98.4 | The Heartbeat of East Africa',
    template: '%s | Savanna FM 98.4',
  },
  description: 'Your city. Your sound. Your station. Listen live to Savanna FM 98.4, Nairobi’s home for Kenyan music, culture, news, sport, and conversations that move East Africa.',
  applicationName: 'Savanna FM 98.4',
  keywords: ['Savanna FM', '98.4 FM', 'Nairobi radio', 'Kenyan radio', 'East African music', 'live radio Kenya', 'podcasts'],
  category: 'music',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Savanna FM 98.4',
    title: 'Savanna FM 98.4 | The Heartbeat of East Africa',
    description: 'Big Kenyan music, real conversations, and the city in every frequency. Live from Nairobi.',
    locale: 'en_KE',
    images: [{ url: '/images/nairobi-crowd.jpg', width: 1600, height: 900, alt: 'Live music crowd under the lights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savanna FM 98.4 | The Heartbeat of East Africa',
    description: 'Listen live from Nairobi. Your city. Your sound. Your station.',
    images: ['/images/nairobi-crowd.jpg'],
  },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#f7f5ed',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const radioStationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RadioStation',
  name: 'Savanna FM 98.4',
  alternateName: 'Savanna FM',
  url: siteUrl,
  description: 'An East African radio station broadcasting music, news, sport, talk, and culture live from Nairobi, Kenya.',
  broadcastDisplayName: 'Savanna FM 98.4',
  broadcastFrequency: {
    '@type': 'BroadcastFrequencySpecification',
    broadcastFrequencyValue: '98.4',
    broadcastFrequencyUnit: 'MHz',
  },
  areaServed: { '@type': 'City', name: 'Nairobi', containedInPlace: { '@type': 'Country', name: 'Kenya' } },
  inLanguage: ['en', 'sw'],
  sameAs: ['https://www.instagram.com/', 'https://x.com/'],
};

const podcastSchema = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'Savanna Sounds',
  url: `${siteUrl}/#podcasts`,
  description: 'On demand conversations, music sessions, and city stories from Savanna FM 98.4 in Nairobi.',
  webFeed: `${siteUrl}/api/podcasts`,
  inLanguage: 'en-KE',
  author: { '@type': 'Organization', name: 'Savanna FM 98.4', url: siteUrl },
  episode: podcasts.map((episode) => ({
    '@type': 'PodcastEpisode',
    name: episode.title,
    episodeNumber: episode.episode.replace(/\D/g, ''),
    datePublished: episode.date,
    timeRequired: `PT${episode.duration.match(/\d+/)?.[0] || 0}M`,
    partOfSeries: { '@type': 'PodcastSeries', name: 'Savanna Sounds' },
  })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(radioStationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }} />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
