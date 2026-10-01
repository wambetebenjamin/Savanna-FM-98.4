import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savannafm.co.ke';
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
}
