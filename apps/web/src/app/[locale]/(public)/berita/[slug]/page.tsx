
export const revalidate = 3600; // Cache for 1 hour

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { ChevronRight, Calendar, ArrowLeft, User, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ui/animations/ScrollReveal";
import BeritaActionButtons from "@/components/public/BeritaActionButtons";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  
  const { data: otherNews } = await supabase
    .from("news_articles")
    .select("title, slug, date_published, image_url")
    .neq("slug", resolvedParams.slug)
    .order("date_published", { ascending: false })
    .limit(3);


  const { data: news, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !news) {
    console.error("Supabase Error on NewsDetailPage:", error, "Slug:", resolvedParams.slug);
    notFound();
  }

  const cleanHTML = (news.content || "").replace(/&nbsp;/g, ' ');
  const formattedDate = new Date(news.date_published).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[45vh] md:h-[70vh] bg-black">
        <Image
          src={news.image_url || "/hero-bg.webp"}
          alt={news.title || "Berita"}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f5] via-[#fcf9f5]/90 via-30% to-black/40"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-8 md:pb-24">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 w-full">
            <nav className="flex text-white/80 text-xs md:text-sm mb-3 md:mb-6 items-center gap-1 md:gap-2 font-medium z-10 relative drop-shadow-md flex-wrap">
              <Link className="hover:text-white transition-colors" href="/">Beranda</Link>
              <ChevronRight className="w-4 h-4" />
              <Link className="hover:text-white transition-colors" href="/#berita">Berita & Artikel</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px] md:max-w-xs">{news.title}</span>
            </nav>

            <ScrollReveal>
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 flex-wrap">
                <span className="bg-[#3D7A5E] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  {news.category}
                </span>
                <span className="text-white/90 text-sm font-medium flex items-center gap-1.5 drop-shadow-sm">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              </div>
              <h1 className={`${montserrat.className} text-2xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight drop-shadow-md leading-tight max-w-4xl drop-shadow-lg`}>
                {news.title}
              </h1>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Left Column: Article */}
        <div className="lg:col-span-8 w-full">
          
          {/* Author Meta (Desktop Only, mobile can see it too) */}
          <ScrollReveal>
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#d3c5af]/40">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{news.author || 'Admin TIC Bandung'}</p>
                  <p className="text-sm text-slate-500">{news.author_role || 'Tim Redaksi'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <BeritaActionButtons title={news.title} />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <article 
              lang="ms" className="prose prose-base md:prose-lg prose-slate max-w-none break-words hyphens-auto overflow-x-hidden w-full [&_p]:whitespace-pre-wrap [&_*]:!max-w-full prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#3D7A5E] prose-img:rounded-sm prose-img:shadow-md prose-p:leading-relaxed prose-p:mb-6 first-letter:text-4xl md:first-letter:text-6xl first-letter:font-black first-letter:text-[#3D7A5E] first-letter:mr-2 first-letter:float-left first-letter:leading-none [&_p:empty]:min-h-[1.5rem] [&_p:empty]:block [&_p:has(>br)]:min-h-[1.5rem] [&_.ql-indent-1]:pl-[3rem] [&_.ql-indent-2]:pl-[6rem] [&_.ql-indent-3]:pl-[9rem] [&_.ql-indent-4]:pl-[12rem]"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
          </ScrollReveal>

          {/* Gallery Section */}
          {news.images && news.images.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#d3c5af]/30">
              <h3 className={`${montserrat.className} text-2xl font-bold text-slate-900 mb-6`}>Galeri Foto</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {news.images.map((img: string, i: number) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="relative aspect-square rounded-sm overflow-hidden group shadow-sm hover:shadow-lg transition-shadow cursor-zoom-in">
                      <Image 
                        src={img} 
                        alt={`Galeri ${i+1}`} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-[#d3c5af]/30">
            <Link href="/" className="inline-flex items-center gap-2 text-[#3D7A5E] font-bold hover:text-[#2c5c45] transition-colors">
              <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 w-full">
          <div className="sticky top-24">
            
            {/* Newsletter / CTA Box */}
            <div className="bg-[#3D7A5E] rounded-xl md:rounded-sm p-5 md:p-8 text-white mb-6 md:mb-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className={`${montserrat.className} text-xl font-bold mb-3 relative z-10`}>Jelajahi Bandung!</h3>
              <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">Temukan destinasi wisata terbaik dan nikmati pengalaman liburan tak terlupakan di Kota Kembang.</p>
              <Link href="/#destinasi" className="block w-full py-3 bg-white text-[#3D7A5E] font-bold text-center rounded-xl hover:bg-[#fcf9f5] transition-colors relative z-10 shadow-md">
                Lihat Destinasi
              </Link>
            </div>

            {/* Other News */}
            <h3 className={`${montserrat.className} text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2`}>
              Baca Juga
            </h3>
            
            <div className="flex flex-col gap-6">
              {otherNews && otherNews.map((item, i) => (
                <Link href={`/berita/${item.slug}`} key={i} className="group flex gap-4 items-center bg-white p-3 rounded-sm shadow-sm border border-[#d3c5af]/30 hover:shadow-md transition-all">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image 
                      src={item.image_url || "/hero-bg.webp"} 
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#3D7A5E] font-bold mb-1 line-clamp-1">
                      {new Date(item.date_published).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <h4 className={`${montserrat.className} text-sm font-bold text-slate-900 leading-snug group-hover:text-[#3D7A5E] transition-colors line-clamp-2`}>
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </aside>
      </section>
    </main>
  );
}
