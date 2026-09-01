"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Calendar, ArrowRight } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah popup sudah pernah ditutup (simpan di session storage supaya muncul tiap sesi baru, atau local storage)
    const hasSeenPopup = sessionStorage.getItem("hasSeenCoEPopup");
    
    if (!hasSeenPopup) {
      // Kasih delay sedikit supaya tidak terlalu agresif
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenCoEPopup", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      ></div>

      {/* Popup Content */}
      <div className="relative bg-white rounded-sm w-full max-w-lg overflow-hidden shadow-2xl animate-fade-up">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Image / Pattern */}
        <div className="relative w-full h-40 bg-[#3D7A5E] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-10 -right-10"></div>
          <Calendar className="w-20 h-20 text-white opacity-90 drop-shadow-lg" />
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Segera Dibuka
          </span>
          <h2 className={`${montserrat.className} text-2xl font-bold text-slate-900 mb-3`}>
            Pendaftaran Calendar of Event 2027
          </h2>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">
            Jadikan event Anda bagian dari daya tarik utama pariwisata Kota Bandung. Pendaftaran dan kurasi akan segera dibuka!
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/event" 
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 bg-[#C9971E] hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-amber-500/30"
            >
              Lihat Detail & Persyaratan <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleClose}
              className="w-full py-3 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
