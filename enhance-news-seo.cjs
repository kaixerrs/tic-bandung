const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/berita/[slug]/page.tsx";
let c = fs.readFileSync(p, "utf8");

// 1. Add Metadata generation function
const metadataFunc = `
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: news } = await supabase
    .from("news_articles")
    .select("title, excerpt, image_url, date_published, slug")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!news) return {};

  return {
    title: \`\${news.title} | Berita TIC Kota Bandung\`,
    description: news.excerpt || news.title,
    openGraph: {
      title: news.title,
      description: news.excerpt || news.title,
      url: \`https://ticbandung.com/id/berita/\${news.slug}\`,
      type: "article",
      publishedTime: news.date_published,
      authors: ["Dinas Kebudayaan dan Pariwisata Kota Bandung"],
      images: [
        {
          url: news.image_url || "/logo/tic-og-image.jpg",
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.excerpt || news.title,
      images: [news.image_url || "/logo/tic-og-image.jpg"],
    },
  };
}

export default async function NewsDetailPage`;

if (!c.includes("export async function generateMetadata")) {
  c = c.replace("export default async function NewsDetailPage", metadataFunc);
}

// 2. Add JSON-LD Script
const jsonLdCode = `
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": [news.image_url || "https://ticbandung.com/logo/tic-og-image.jpg"],
    "datePublished": news.date_published,
    "dateModified": news.updated_at || news.date_published,
    "author": [{
        "@type": "Person",
        "name": "Fayiz apriwansyah nugraha",
        "url": "https://ticbandung.com"
      }, {
        "@type": "Organization",
        "name": "Dinas Kebudayaan dan Pariwisata Kota Bandung"
    }]
  };

  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Banner */}`;

if (c.includes("return (") && !c.includes("application/ld+json")) {
  c = c.replace(`  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen">
      {/* Hero Banner */}`, jsonLdCode);
}

fs.writeFileSync(p, c, "utf8");
console.log("News SEO enhanced");
