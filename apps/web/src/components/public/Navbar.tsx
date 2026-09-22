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
  const getHref = (path: string) => locale === 'en' ? '/en' + (path === '/' ? '' : path) : path;
  const navLinks = [
    { id: 'home', name: t('home'), href: getHref('/') },
    { id: 'destinasi', name: t('destinasi'), href: getHref('/kategori') },
    { id: 'event', name: t('event'), href: getHref('/event') },
    { id: 'transportasi', name: t('transportasi'), href: getHref('/transportasi') },
    { id: 'pusatBantuan', name: t('pusatBantuan'), href: getHref('/pusat-bantuan') },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isEventMobileOpen, setIsEventMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/(id|en)/, '') || '/';


  // Reset scroll state on navigation to prevent navbar jump/flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setScrolled(window.scrollY > 20);
    }, 0);
    return () => clearTimeout(timer);
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
          <img src="/logo/logo-final.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />
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
            
            if (link.id === 'event') {
              return (
                <div key={link.id} className="relative group">
                  <button className={`font-label-caps text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 flex items-center gap-1 ${
                    isTransparent 
                      ? (isActive ? 'text-white' : 'text-white/80 hover:text-[#FFCC00]')
                      : (isActive ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]')
                  }`}>
                    {link.name}
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px] flex flex-col gap-1">
                      <a href="https://drive.google.com/file/d/1QEzKICi45dPbrHemEN6uBS-5vKVTG0O7/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">COE 2026</a>
                      <Link href={getHref('/event/pendaftaran')} className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Form COE 2027</Link>
                      </div>
                  </div>
                </div>
              );
            }
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
        className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-6 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = normalizedPathname === link.href || (link.href !== '/' && normalizedPathname.startsWith(link.href));
            
            if (link.id === 'event') {
              return (
                <div key={link.id} className="flex flex-col">
                  <button 
                    onClick={() => setIsEventMobileOpen(!isEventMobileOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {link.name}
                    <svg className={`w-4 h-4 transition-transform ${isEventMobileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div className={`flex flex-col gap-1 pl-4 pr-2 overflow-hidden transition-all duration-300 ${isEventMobileOpen ? 'max-h-40 py-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <a 
                      href="https://drive.google.com/file/d/1QEzKICi45dPbrHemEN6uBS-5vKVTG0O7/view?usp=drivesdk" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-amber-600 rounded-lg transition-colors"
                    >
                      COE 2026
                    </a>
                    <Link 
                      href={getHref('/event/pendaftaran')} 
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-amber-600 rounded-lg transition-colors"
                    >
                      Form COE 2027
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link 
                key={link.id || link.name}
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
            
          </div>

        </div>
      </div>
    </nav>
  );
}





