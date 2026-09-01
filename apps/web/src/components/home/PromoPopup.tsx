"use client";
import { useTranslations } from 'next-intl';

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Calendar, ArrowRight, Sparkles, Clock } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function PromoPopup() {
  const t = useTranslations('Components');
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenCoEPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        requestAnimationFrame(() => setIsAnimating(true));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem("hasSeenCoEPopup", "true");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div className={`relative w-full max-w-md overflow-hidden rounded-2xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 ${isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"}`}>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white/15 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all hover:rotate-90 duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Section - Dark gradient with decorative elements */}
        <div className="relative w-full h-52 bg-gradient-to-br from-[#0a2e1f] via-[#1a4d35] to-[#0d3d2a] overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute w-40 h-40 bg-[#00C853]/20 rounded-full blur-[60px] -top-10 -right-10 animate-pulse" />
          <div className="absolute w-32 h-32 bg-[#C9971E]/15 rounded-full blur-[50px] bottom-0 left-10 animate-pulse" style={{ animationDelay: "1s" }} />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          {/* Floating badge */}
          <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-[#00C853]/20 border border-[#00C853]/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-[#00C853]" />
            <span className="text-[10px] font-bold text-[#00C853] uppercase tracking-widest">Open Registration</span>
          </div>
          
          {/* Central icon composition */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-3 shadow-2xl">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#C9971E] flex items-center justify-center shadow-lg shadow-amber-500/30 -rotate-6">
                <span className="text-white font-black text-sm">27</span>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C853]/50 to-transparent" />
        </div>

        {/* Body Section */}
        <div className="bg-white p-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 text-amber-700 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5">
            <Clock className="w-3 h-3" />
            Pendaftaran Dibuka
          </div>

          <h2 className={`${montserrat.className} text-2xl font-black text-slate-900 mb-3 leading-tight`}>
            Calendar of Event<br />
            <span className="text-[#C9971E]">Kota Bandung 2027</span>
          </h2>

          <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
            Jadikan event Anda bagian dari daya tarik utama pariwisata Kota Bandung tahun 2027.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/event"
              onClick={handleClose}
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00C853] to-[#009e42] hover:from-[#009e42] hover:to-[#007a33] text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm tracking-wide"
            >
              Lihat Detail & Persyaratan
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={handleClose}
              className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors tracking-wide"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
