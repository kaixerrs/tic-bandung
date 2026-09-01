"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Home, Search, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#C9971E]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3D7A5E]/10 blur-[100px] pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Floating Icon Animation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9971E]/40"
            />
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-xl flex items-center justify-center text-[#3D7A5E] border border-gray-100 relative z-10">
              <Compass className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-9xl font-bold font-display text-[#1b1c1a] tracking-tighter mb-4">
            4<span className="text-[#C9971E]">0</span>4
          </h1>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-[#2d2a26] mb-4">
            Tersesat di Kota Kembang?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base md:text-lg mb-10 leading-relaxed">
            Sepertinya rute yang Anda tuju tidak ditemukan di peta kami. Mari kembali ke jalur utama dan lanjutkan penjelajahan Anda di Bandung.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[#3D7A5E] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#2c5a45] transition-all duration-300 shadow-[0_8px_30px_rgb(61,122,94,0.3)] hover:shadow-[0_8px_30px_rgb(61,122,94,0.5)] hover:-translate-y-1"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Beranda</span>
          </Link>
          <Link 
            href="/kategori" 
            className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-[#1b1c1a] border border-gray-200 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <Map className="w-5 h-5 text-gray-500 group-hover:text-[#C9971E] transition-colors" />
            <span>Jelajah Destinasi</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
