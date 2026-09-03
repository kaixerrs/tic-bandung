import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ticbandung.com';
  const supabase = await createClient();

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/kategori',
    '/event',
    '/transportasi',
    '/berita',
    '/pusat-bantuan'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for both id and en
  staticRoutes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}/id${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' || route === '/berita' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    });
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' || route === '/berita' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    });
  });

  // 2. Dynamic News Routes
  const { data: newsArticles } = await supabase
    .from('news_articles')
    .select('slug, updated_at, date_published')
    .eq('status', 'published');

  if (newsArticles) {
    newsArticles.forEach((news) => {
      sitemapEntries.push({
        url: `${baseUrl}/id/berita/${news.slug}`,
        lastModified: new Date(news.updated_at || news.date_published || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
      sitemapEntries.push({
        url: `${baseUrl}/en/berita/${news.slug}`,
        lastModified: new Date(news.updated_at || news.date_published || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  }

  // Note: We skip destinations because they redirect directly to GDrive (no local details page).

  return sitemapEntries;
}
