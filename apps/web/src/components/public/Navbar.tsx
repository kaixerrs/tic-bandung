'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700', '900'] });

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Destinasi Wisata', href: '/kategori' },
  { name: 'Calendar of Event', href: '/event' },
  { name: 'Transportasi', href: '/transportasi' },
  { name: 'Pusat Bantuan', href: '/pusat-bantuan' },
];

export default function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const getHref = (path) => locale === 'en' ? '/en' + (path === '/' ? '' : path) : path;
  const navLinks = [
    { id: 'home', name: t('home'), href: getHref('/') },
    { id: 'destinasi', name: t('destinasi'), href: getHref('/kategori') },
    { id: 'event', name: t('event'), href: getHref('/event') },
    { id: 'transportasi', name: t('transportasi'), href: getHref('/transportasi') },
    { id: 'pusatBantuan', name: t('pusatBantuan'), href: getHref('/pusat-bantuan') },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/(id|en)/, '') || '/';


  // Reset scroll state on navigation to prevent navbar jump/flicker
  useEffect(() => {
    setScrolled(window.scrollY > 20);
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
        <nav 
      className={`${normalizedPathname === '/' ? 'fixed' : 'sticky'} top-0 w-full z-[2000] transition-all duration-300 ${
        scrolled || normalizedPathname !== '/'
          ? 'bg-white/90 backdrop-blur-md py-3 border-b border-slate-200 shadow-sm' 
          : 'bg-transparent py-6 border-b border-white/20'
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 flex items-center gap-2 md:gap-3">
          <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col drop-shadow-md">
            <span className={`text-sm md:text-lg font-bold leading-tight ${scrolled || normalizedPathname !== '/' ? 'text-slate-900' : 'text-white'}`}>
              KOTA BANDUNG
            </span>
            <span className={`font-label-caps text-[8px] md:text-[10px] ${scrolled || normalizedPathname !== '/' ? 'text-[#00C853]' : 'text-white/80'}`}>
              TOURIST INFORMATION CENTER
            </span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = normalizedPathname === link.href || (link.href !== '/' && normalizedPathname.startsWith(link.href));
            const isTransparent = normalizedPathname === '/' && !scrolled;
            
            return (
              <Link 
                key={link.id}
                href={link.href}
                className={`relative font-label-caps text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isTransparent 
                    ? (isActive ? 'text-white' : 'text-white/80 hover:text-[#FFCC00]')
                    : (isActive ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]')
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Side - Paket Wisata Button */}
        <div className="hidden lg:flex items-center gap-5">
          <LanguageSwitcher isTransparent={normalizedPathname === '/' && !scrolled} />
          <Link 
            href={locale === 'en' ? '/en/paket-wisata' : '/paket-wisata'}
            className={`px-8 py-3 font-label-caps uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 ${
              normalizedPathname === '/' && !scrolled
                ? 'bg-white text-[#1A1A1A] hover:bg-[#00C853] hover:text-white'
                : 'bg-[#00C853] text-white hover:bg-[#0050A2] hover:text-white'
            }`}
          >{locale === 'en' ? 'TOUR PACKAGES' : 'PAKET WISATA'}</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`lg:hidden p-2 rounded-full transition-colors ${normalizedPathname === '/' && !scrolled ? 'text-white hover:bg-white/20' : 'text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = normalizedPathname === link.href || (link.href !== '/' && normalizedPathname.startsWith(link.href));
            return (
              <Link 
                key={link.name}
                onClick={() => setIsOpen(false)} 
                className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                  isActive 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'
                }`} 
                href={link.href}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            <Link 
              href={locale === 'en' ? '/en/paket-wisata' : '/paket-wisata'}
              onClick={() => setIsOpen(false)}
              className="flex w-full justify-center px-4 py-3 bg-[#3D7A5E] text-white text-sm font-bold rounded-xl shadow-sm"
            >
              Paket Wisata
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}





