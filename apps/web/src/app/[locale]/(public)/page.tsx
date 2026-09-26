import Link from 'next/link';
import Image from 'next/image';
import GalleryAutoSlider from '@/components/public/GalleryAutoSlider';
import { Search, Map, Utensils, Sun, Landmark, Calendar, MapPin, Bus, Star, Compass, Download, Heart, ArrowRight, Camera, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import HeroSlider from '@/components/home/HeroSlider';
import CoECountdownBanner from '@/components/home/CoECountdownBanner';
import PromoPopup from '@/components/home/PromoPopup';
import FAQSection from '@/components/home/FAQSection';
import { createClient } from '@/utils/supabase/server';
import { Montserrat } from 'next/font/google';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });



export const revalidate = 3600; // Cache for 1 hour

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const supabase = await createClient();

  const { data: activeFaqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order_num', { ascending: true })
    .order('created_at', { ascending: false });


  // Fetch Hero Sliders
  const { data: heroSliders } = await supabase
    .from('hero_sliders')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Fetch News Articles
  const { data: newsArticles } = await supabase
    .from('news_articles')
    .select('*')
    .eq('status', 'published')
    .order('date_published', { ascending: false })
    .limit(4);

  // Fetch Galleries
  const { data: rawGalleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .limit(20);

  // Fetch specific destinations to integrate images dynamically while keeping layout static
  const { data: staticDests } = await supabase
    .from('destinations')
    .select('slug, images')
    .in('slug', ['gedung-sate', 'alun-alun-bandung', 'jalan-braga']);

  const getDestImg = (slug: string) => {
    const dest = staticDests?.find((d) => d.slug === slug);
    return dest && dest.images && dest.images.length > 0 ? dest.images[0] : null;
  };

  // Default sliders sebagai fallback dengan gambar yang valid!
  const defaultSliders = [
    {
      id: 'default-1',
      title: "Gedung Sate",
      subtitle: "Ikon bersejarah perpaduan arsitektur Eropa dan Nusantara di jantung kota.",
      title_en: "Gedung Sate",
      subtitle_en: "Historic icon blending European and Nusantara architecture in the heart of the city.",
      image_url: "/gedung-sate.webp",
      button_link: "/destinasi/gedung-sate"
    },
    {
      id: 'default-2',
      title: "Jalan Asia Afrika",
      subtitle: "Saksi bisu Konferensi Asia Afrika dengan pesona malam yang romantis.",
      title_en: "Asia Afrika Street",
      subtitle_en: "Silent witness of the Asian-African Conference with romantic night charm.",
      image_url: "/ASET VISUAL/jalan-asia-afrika.jpg",
      button_link: "/destinasi/jalan-asia-afrika"
    },
    {
      id: 'default-3',
      title: "Bandros",
      subtitle: "Jelajahi keindahan alam, budaya, dan kuliner legendaris Parijs van Java.",
      title_en: "Bandros",
      subtitle_en: "Explore the natural beauty, culture, and legendary culinary of Parijs van Java.",
      image_url: "/ASET VISUAL/bandros.jpg",
      button_link: "/kategori"
    },
    {
      id: 'default-4',
      title: "Boseh",
      subtitle: "Nikmati udara segar dan keindahan kota Bandung dengan bersepeda santai.",
      title_en: "Boseh",
      subtitle_en: "Enjoy the fresh air and beauty of Bandung city with a relaxing bike ride.",
      image_url: "/ASET VISUAL/boseh.jpg",
      button_link: "/transportasi"
    }
  ];

  // Gunakan data dari CMS jika ada, jika tidak gunakan default
  const activeSliders = (heroSliders && heroSliders.length > 0) ? heroSliders.map(h => ({
    ...h,
    title: locale === 'en' && h.title_en ? h.title_en : h.title,
    subtitle: locale === 'en' && h.subtitle_en ? h.subtitle_en : h.subtitle,
  })) : defaultSliders.map(h => ({
    ...h,
    title: locale === 'en' && h.title_en ? h.title_en : h.title,
    subtitle: locale === 'en' && h.subtitle_en ? h.subtitle_en : h.subtitle,
  }));

  // Default fallback data for news if empty
  const defaultNews = [
    {
      id: 'news-1',
      category: "Tips Liburan", 
      color_theme: "emerald",
      title: "Panduan Lengkap Wisata Keluarga di Kota Bandung Akhir Pekan",
      title_en: "Complete Guide for Family Vacation in Bandung this Weekend",
      date_published: "2026-08-12T00:00:00Z",
      image_url: null
    },
    {
      id: 'news-2',
      category: "Tourism Update", 
      color_theme: "blue",
      title: "Persiapan Kota Bandung Menyambut Konferensi Internasional 2027",
      title_en: "Bandung's Preparation for the 2027 International Conference",
      date_published: "2026-08-10T00:00:00Z",
      image_url: null
    },
    {
      id: 'news-3',
      category: "Kuliner Lokal", 
      color_theme: "amber",
      title: "5 Kafe Legendaris di Jalan Braga yang Wajib Anda Kunjungi",
      title_en: "5 Legendary Cafes in Braga Street You Must Visit",
      date_published: "2026-08-08T00:00:00Z",
      image_url: null
    }
  ];

  const galleries = rawGalleries?.map(g => ({
    ...g,
    title: locale === 'en' && g.title_en ? g.title_en : g.title,
    description: locale === 'en' && g.description_en ? g.description_en : g.description,
  })) || [];

  const activeNews = (newsArticles && newsArticles.length > 0) ? newsArticles.map(n => ({
    ...n,
    title: locale === 'en' && n.title_en ? n.title_en : n.title,
    content: locale === 'en' && n.content_en ? n.content_en : n.content,
  })) : defaultNews.map(n => ({
    ...n,
    title: locale === 'en' && n.title_en ? n.title_en : n.title,
  }));

  return (
    <main className="min-h-screen bg-background overflow-hidden relative">
      

      <PromoPopup />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "TIC Kota Bandung",
  "alternateName": "Tourist Information Center Kota Bandung",
  "url": "https://ticbandung.com",
  "logo": "https://ticbandung.com/logo/logo-final.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-22-1234567",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": ["id", "en"]
  },
  "sameAs": [
    "https://twitter.com/DisbudparBdg",
    "https://instagram.com/disbudpar.bdg"
  ]
}) }}
      />
      <HeroSlider sliders={activeSliders} />
      <CoECountdownBanner />

      {/* REKOMENDASI DESTINASI WISATA - HIDDEN PER USER REQUEST */}
      {false && <section className="py-12 md:py-24 px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-20 border-b border-outline-variant/30 pb-8">
          <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">{t('eksplorasi')}</span>
          <h2 className="font-headline-lg text-[40px] md:text-[64px] font-black text-[#1A1A1A] uppercase tracking-widest leading-none">{t('destinasi')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto_auto] gap-4 md:gap-8 md:h-[600px] lg:h-[800px]">
          {/* Main Large Card */}
          <Link href="/destinasi/gedung-sate" className="md:col-span-2 md:row-span-2 relative overflow-hidden group cursor-pointer h-[300px] md:h-auto rounded-sm">
            {getDestImg('gedung-sate') ? (
              <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={getDestImg('gedung-sate')} alt="Gedung Sate" className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-[#C9971E]/20 flex items-center justify-center"><ImageIcon className="w-16 h-16 text-white/20" /></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
              <span className="border border-[#FFCC00] text-[#FFCC00] px-4 py-2 font-label-caps text-[10px] mb-4 inline-block tracking-widest rounded-full  bg-black/40 backdrop-blur-sm">{t('ikonKota')}</span>
              <h3 className="font-headline-lg text-3xl md:text-headline-lg text-white uppercase tracking-widest">{t('gedungSate')}</h3>
            </div>
          </Link>
          {/* Top Right Card */}
          <Link href="/destinasi/alun-alun-bandung" className="md:col-span-2 relative overflow-hidden group cursor-pointer h-[250px] md:h-auto rounded-sm">
            {getDestImg('alun-alun-bandung') ? (
              <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={getDestImg('alun-alun-bandung')} alt="Alun-Alun Bandung" className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center"><ImageIcon className="w-16 h-16 text-white/20" /></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
              <span className="border border-[#FFCC00] text-[#FFCC00] px-4 py-2 font-label-caps text-[10px] mb-4 inline-block tracking-widest rounded-full  bg-black/40 backdrop-blur-sm">{t('alamRekreasi')}</span>
              <h3 className="font-headline-md text-2xl md:text-headline-md text-white uppercase tracking-widest">{t('alunAlun')}</h3>
            </div>
          </Link>
          {/* Bottom Right Small Cards */}
          <Link href="/destinasi/jalan-braga" className="md:col-span-1 relative overflow-hidden group cursor-pointer h-[250px] md:h-auto rounded-sm">
            {getDestImg('jalan-braga') ? (
              <Image fill sizes="(max-width: 768px) 100vw, 25vw" src={getDestImg('jalan-braga')} alt="Jalan Braga" className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center"><ImageIcon className="w-16 h-16 text-white/20" /></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
              <span className="border border-[#FFCC00] text-[#FFCC00] px-3 py-1 font-label-caps text-[10px] mb-3 inline-block tracking-widest rounded-full  bg-black/40 backdrop-blur-sm">{t('warisan')}</span>
              <h3 className="font-body-lg text-lg md:text-body-lg font-bold text-white uppercase tracking-wider">{t('jalanBraga')}</h3>
            </div>
          </Link>
          <Link href="/kategori" className="md:col-span-1 relative overflow-hidden bg-[#00C853] group cursor-pointer flex flex-col items-center justify-center p-6 md:p-8 text-center h-[250px] md:h-auto hover:bg-[#1A1A1A] transition-all duration-500 rounded-sm hover:shadow-electric-green hover:-translate-y-2">
            <h3 className="font-headline-md text-3xl md:text-headline-md text-white mb-6 uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: t('limaPuluhPlus') }}></h3>
            <span className="text-white font-label-caps text-[14px] font-bold flex items-center uppercase tracking-widest border-b-2 border-white pb-1">
              {t('jelajahi')} <ArrowRight className="ml-3 w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>}

      {/* BERITA & ARTIKEL WISATA */}
      <section className="py-12 md:py-24 px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 border-b border-outline-variant/30 pb-8">
          <div>
            <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">{t('updateTerkini')}</span>
            <h2 className="font-headline-lg text-[40px] md:text-[64px] font-black text-[#1A1A1A] uppercase tracking-widest leading-none">{t('artikel')}</h2>
          </div>
          <Link href="/berita" className="mt-6 md:mt-0 text-[#00C853] font-bold flex items-center hover:text-[#009e42] transition-colors text-[14px] md:text-[16px] uppercase tracking-widest">
            {t('lihatSemua')} <ArrowRight className="ml-4 w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {activeNews && activeNews.length > 0 ? (
            activeNews.map((item, i) => (
              <Link key={item.id} href={`/berita/${item.slug || '#'}`} className="group cursor-pointer bg-white p-3 md:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-electric-green transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-3 md:mb-6 rounded-sm bg-surface-container-high">
                  {item.image_url ? (
                    <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={item.thumbnail_url || item.image_url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={locale === 'en' ? (item.title_en || item.title) : item.title} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-outline opacity-50" /></div>
                  )}
                </div>
                <span className={`text-[#0050A2] font-label-caps text-[8px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-4 inline-block bg-surface-container-low px-3 py-1 rounded-full`}>{item.category}</span>
                <h3 className="font-headline-md text-sm md:text-xl lg:text-headline-md text-on-surface group-hover:text-[#00C853] transition-colors mb-2 md:mb-6 tracking-wide leading-tight line-clamp-3">{locale === 'en' ? (item.title_en || item.title) : item.title}</h3>
                <div className="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-2 md:pt-4">
                  <span className="font-label-caps text-[9px] md:text-xs tracking-widest">
                    {new Date(item.date_published).toLocaleDateString(locale, {day: 'numeric', month: 'long', year: 'numeric'}).toUpperCase()}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-on-surface-variant">{t('noNews')}</div>
          )}
        </div>
      </section>
      {/* GALERI FOTO */}
      <section className="py-12 md:py-24 px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 border-b border-outline-variant/30 pb-8">
          <div>
            <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">{t('visualKota')}</span>
            <h2 className="font-headline-lg text-[40px] md:text-[64px] font-black text-[#1A1A1A] uppercase tracking-widest leading-none">{t('galeri')}</h2>
          </div>
        </div>
        <GalleryAutoSlider 
          galleries={galleries || []} 
          locale={locale} 
          noGalleryText={t('noGallery')} 
        />
      </section>

      {/* FAQ SECTION */}
      <FAQSection dynamicFaqs={activeFaqs || []} />
    </main>
  );
}

