"use client";
import { useTranslations } from 'next-intl';

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function PromoPopup() { 
  const t = useTranslations('Promo');
  const t = useTranslations('Components');
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenCoEPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        requestAnimationFrame(() => setShow(true));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem("hasSeenCoEPopup", "true");
    }, 250);
  };

  if (!isOpen) return null;

  const backdropCls = `absolute inset-0 bg-black/50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`;
  const cardCls = `relative w-full max-w-lg bg-white rounded-sm overflow-hidden shadow-2xl transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;
  const titleCls = `${montserrat.className} text-2xl font-bold text-[#1A1A1A] leading-snug mb-2`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className={backdropCls} onClick={handleClose} />

      <div className={cardCls}>
        {/* Accent bar */}
        <div className="h-1.5 bg-[#00C853]" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-7">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#00C853] bg-[#00C853]/10 px-3 py-1 rounded-full mb-5">
            Pendaftaran Dibuka
          </span>

          <h2 className={titleCls}>
            Calendar of Event<br />
            Kota Bandung 2027
          </h2>

          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Daftarkan event unggulan Anda untuk masuk kurasi resmi Disbudpar Kota Bandung.
          </p>

          <Link
            href="/event"
            onClick={handleClose}
            className="group flex items-center justify-center gap-2 w-full bg-[#1A1A1A] hover:bg-[#00C853] text-white py-3.5 rounded-sm font-bold text-sm tracking-wide transition-colors duration-200"
          >
            Lihat Detail
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-slate-400 hover:text-slate-600 text-xs transition-colors"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}
