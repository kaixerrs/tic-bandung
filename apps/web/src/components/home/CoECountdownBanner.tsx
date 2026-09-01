"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, MapPin } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function CoECountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Target date: September 15, 2026, 23:59:59 (End of day)
    // Use the user's current year/month based on the context: 2026-09-15
    const targetDate = new Date("2026-09-15T23:59:59").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <section className="w-full bg-white relative overflow-hidden py-12 md:py-16 border-y border-slate-100 z-40 mb-20">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9971E]/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3D7A5E]/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* Left side: Text & Info */}
        <div className="text-center lg:text-left flex-1 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#3D7A5E]/20 border border-[#3D7A5E]/30 text-[#4ade80] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Calendar className="w-4 h-4" />
            <span>DIBUKA</span>
          </div>
          
          <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight`}>
            Pendaftaran Calendar of Event <span className="text-[#C9971E]">2027</span>
          </h2>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
            Punya event unggulan di Kota Bandung? Daftarkan segera untuk masuk ke dalam kurasi resmi Calendar of Event (CoE) Dinas Kebudayaan dan Pariwisata Kota Bandung tahun 2027.
          </p>

          <Link 
            href="/event" 
            className="inline-flex items-center justify-center gap-2 bg-[#C9971E] hover:bg-amber-600 active:scale-95 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            Daftar Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Right side: Countdown Timer Box */}
        <div className="w-full lg:w-auto shrink-0 bg-[#fcf9f5] border border-slate-200 p-4 md:p-8 rounded-sm md:rounded-sm shadow-xl relative">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-600 font-bold mb-6">
            <Clock className="w-5 h-5 text-[#C9971E]" />
            <span>Batas Waktu Pendaftaran:</span>
          </div>

          {/* Countdown Grid */}
          <div className="flex justify-center gap-2 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-sm flex items-center justify-center text-xl md:text-4xl font-bold text-[#C9971E] shadow-sm border border-slate-200">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-wider font-bold">Hari</span>
            </div>
            
            <div className="text-xl md:text-4xl font-bold text-slate-300 mt-4 md:mt-5">:</div>
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-sm flex items-center justify-center text-xl md:text-4xl font-bold text-slate-800 shadow-sm border border-slate-200">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-wider font-bold">Jam</span>
            </div>
            
            <div className="text-xl md:text-4xl font-bold text-slate-300 mt-4 md:mt-5">:</div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-sm flex items-center justify-center text-xl md:text-4xl font-bold text-slate-800 shadow-sm border border-slate-200">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-wider font-bold">Menit</span>
            </div>

            <div className="text-xl md:text-4xl font-bold text-slate-300 mt-4 md:mt-5">:</div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-sm flex items-center justify-center text-xl md:text-4xl font-bold text-[#3D7A5E] shadow-sm border border-slate-200">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-wider font-bold">Detik</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-slate-600 font-bold bg-slate-200/50 py-2 rounded-sm">
            Ditutup: 15 September 2026, 23:59 WIB
          </div>
        </div>
        
      </div>
    </section>
  );
}
