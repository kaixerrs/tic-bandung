"use client";

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { MapPin, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Noto_Sans_Sundanese, Allison } from 'next/font/google';
const allisonFont = Allison({ subsets: ['latin'], weight: '400' });

const sundaFont = Noto_Sans_Sundanese({ subsets: ['sundanese'], weight: '400' });

interface SliderData {
  id: string;
  title: string;
title_en?: string;
  subtitle: string;
subtitle_en?: string;
  image_url: string;
  button_link: string;
}

export default function HeroSlider({ sliders }: { sliders: SliderData[] }) { 
  const t = useTranslations('Hero');
  const tComp = useTranslations('Components');
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/pencarian`);
    }
  };

  useEffect(() => {
    if (!sliders || sliders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliders]);

  if (!sliders || sliders.length === 0) return null;

  return (
    <header className="relative w-full h-[100svh] min-h-[700px] overflow-hidden bg-bandung-hitam">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandLine {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-8px) rotate(-4deg); }
        }
        .animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-delay-1 { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-slide-up-delay-2 { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-slide-up-delay-3 { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
        .animate-expand-line { animation: expandLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; width: 0; }
        .animate-float-badge { animation: floatBadge 3s ease-in-out infinite; }
      `}} />

      {/* Background Images with Ken Burns */}
      {sliders.map((slider, index) => (
        <Image
          key={index}
          alt={slider.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center z-0 transition-all duration-[2000ms] ease-in-out ${
            index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          src={encodeURI(slider.image_url)}
        />
      ))}
      
      {/* Layered Gradient Overlay */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-[11] pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-white"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-white"></div>
      </div>

      {/* Slide Counter - Left Side */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4">
        <span className="font-label-caps text-white/90 text-sm tracking-widest">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <div className="w-px h-16 bg-white/30 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-bandung-kuning transition-all duration-[6000ms] ease-linear"
            style={{ height: '100%' }}
            key={currentIndex}
          ></div>
        </div>
        <span className="font-label-caps text-white/50 text-sm tracking-widest">
          {String(sliders.length).padStart(2, '0')}
        </span>
      </div>

      {/* Content Container */}
      <div className="relative z-40 text-center px-4 max-w-5xl mx-auto flex flex-col items-center h-full justify-start pt-48 md:justify-center md:pt-0">
                {/* Main Title */}
        <div className="relative mb-8 text-center flex flex-col items-center justify-center">
          
          
          <h1 className="text-[40px] sm:text-[48px] md:text-[80px] lg:text-[96px] font-extrabold leading-none text-white uppercase tracking-wider drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-6 md:mb-10 z-10 relative">
            {t('subtitle')}
          </h1>
          
          <h1 className={`${allisonFont.className} text-[100px] sm:text-[130px] md:text-[200px] lg:text-[260px] leading-[0.4] text-[#00C853] mb-8 mt-[-15px] md:mt-[-30px] lg:mt-[-40px] z-10 relative`} style={{ textShadow: '0 4px 20px rgba(0, 200, 83, 0.5), 0 0 80px rgba(0, 122, 51, 0.3)' }}>
            Bandung
          </h1>
        </div>

        {/* Subtitle */}
        <p className="hidden md:block font-body-lg text-[14px] md:text-[20px] text-white/90 mb-8 md:mb-12 max-w-2xl tracking-wide leading-relaxed px-4 drop-shadow-md font-medium">
          {t('desc')}
        </p>
        
        {/* Discovery Bar */}
        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-lg p-1.5 md:p-2 flex items-center rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] mx-auto relative z-50">
          <div className="flex-grow px-3 md:px-6 flex items-center border-r border-gray-200 py-1.5 md:py-3">
            <MapPin className="text-bandung-hijau mr-2 md:mr-4 w-4 h-4 md:w-5 md:h-5 shrink-0" />
            <input className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:outline-none font-body-md text-xs md:text-sm font-semibold tracking-wider" placeholder={t('searchPlaceholder')} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  />
          </div>
          
          <button type="submit" className="bg-[#00C853] text-white px-4 py-2.5 md:px-10 md:py-4 font-extrabold text-xs md:text-base hover:bg-[#009e42] transition-all duration-300 flex items-center font-label-caps tracking-widest rounded-xl shadow-[0_8px_20px_rgba(0,122,51,0.3)] hover:shadow-[0_12px_25px_rgba(0,122,51,0.5)] hover:-translate-y-0.5 ml-2">
            {locale === 'en' ? 'SEARCH' : 'CARI'}
          </button>
        </form>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-label-caps text-white/50 text-[10px] tracking-widest uppercase">{t('scroll')}</span>
        <ChevronDown className="w-5 h-5 text-white/50" />
      </div>

      {/* Slide Info & Indicators - Bottom Right */}
      <div className="absolute bottom-10 md:bottom-8 right-4 md:right-10 flex flex-col items-end gap-2 md:gap-3 z-30 text-right w-[85%] max-w-[220px] md:max-w-xs">
        <div key={`info-${currentIndex}`} className="animate-slide-up flex flex-col items-end bg-black/50 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-[2px] shadow-2xl w-full">
          <h3 className="text-white font-display font-bold text-lg md:text-2xl lg:text-3xl drop-shadow-md mb-2">
            {sliders[currentIndex]?.title}
          </h3>
          <p className="text-white/90 font-body text-[10px] md:text-sm drop-shadow-sm line-clamp-2 md:line-clamp-3">
            {sliders[currentIndex]?.subtitle}
          </p>
          {sliders[currentIndex]?.button_link && (
            <Link href={sliders[currentIndex].button_link as string} className="inline-flex items-center justify-end gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-[2px] text-[10px] md:text-xs font-bold uppercase tracking-widest text-bandung-kuning hover:text-white transition-all">
              {locale === 'en' ? 'EXPLORE NOW' : 'JELAJAHI SEKARANG'} <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === currentIndex ? "w-12 bg-bandung-kuning shadow-electric-yellow" : "w-4 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
