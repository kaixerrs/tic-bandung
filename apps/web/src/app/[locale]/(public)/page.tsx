import Link from 'next/link';
import Image from 'next/image';
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
    .limit(3);

  // Fetch Galleries
  const { data: rawGalleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .limit(4);

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
  })) : defaultSliders;

  // Default fallback data for news if empty
  const defaultNews = [
    {
      id: 'news-1',
      category: "Tips Liburan", 
      color_theme: "emerald",
      title: "Panduan Lengkap Wisata Keluarga di Kota Bandung Akhir Pekan",
      date_published: "2026-08-12T00:00:00Z",
      image_url: null
    },
    {
      id: 'news-2',
      category: "Tourism Update", 
      color_theme: "blue",
      title: "Persiapan Kota Bandung Menyambut Konferensi Internasional 2027",
      date_published: "2026-08-10T00:00:00Z",
      image_url: null
    },
    {
      id: 'news-3',
      category: "Kuliner Lokal", 
      color_theme: "amber",
      title: "5 Kafe Legendaris di Jalan Braga yang Wajib Anda Kunjungi",
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
  })) : defaultNews;

  return (
    <main className="min-h-screen bg-background overflow-hidden relative">
      

      <PromoPopup />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {activeNews && activeNews.length > 0 ? (
            activeNews.map((item, i) => (
              <Link key={item.id} href={`/berita/${item.slug || '#'}`} className="group cursor-pointer bg-white p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-electric-green transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                <div className="relative w-full h-[250px] md:h-80 overflow-hidden mb-6 rounded-sm bg-surface-container-high">
                  {item.image_url ? (
                    <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={item.image_url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={locale === 'en' ? (item.title_en || item.title) : item.title} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-outline opacity-50" /></div>
                  )}
                </div>
                <span className={`text-[#0050A2] font-label-caps text-[10px] uppercase tracking-widest mb-4 inline-block  bg-surface-container-low px-3 py-1 rounded-full`}>{item.category}</span>
                <h3 className="font-headline-md text-xl md:text-headline-md text-on-surface group-hover:text-[#00C853] transition-colors mb-6 tracking-wide leading-tight line-clamp-3">{locale === 'en' ? (item.title_en || item.title) : item.title}</h3>
                <div className="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-4">
                  <span className="font-label-caps text-xs tracking-widest">
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
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-6 md:grid-cols-4 md:grid-rows-[auto_auto] md:h-[500px] lg:h-[600px] pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {(galleries && galleries.length > 0) ? (
            galleries.map((item: any, i: number) => {
              let gridClass = 'min-w-[60vw] md:min-w-0 md:col-span-1 h-[250px] md:h-auto snap-start';
              if (i === 0) gridClass = 'min-w-[80vw] md:min-w-0 md:col-span-2 md:row-span-2 h-[250px] md:h-auto snap-start';
              else if (i === 1) gridClass = 'min-w-[70vw] md:min-w-0 md:col-span-2 h-[250px] md:h-auto snap-start';
              
              return (
              <div key={item.id} className={`relative group overflow-hidden rounded-sm ${gridClass} cursor-pointer shadow-sm hover:shadow-electric-yellow transition-all duration-500`}>
                <Image 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  src={item.image_url} 
                  alt={item.title || 'Galeri Bandung'} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-headline-md text-2xl md:text-3xl text-white font-bold tracking-wider mb-2">{locale === 'en' ? (item.title_en || item.title) : item.title}</h3>
                  {item.description && <p className="text-white/80 font-body-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{locale === 'en' ? (item.description_en || item.description) : item.description}</p>}
                </div>
              </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">{t('noGallery')}</div>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />
    </main>
  );
}

