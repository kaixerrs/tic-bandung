"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Apa itu Tourist Information Center (TIC) Kota Bandung?",
    answer: "TIC Kota Bandung adalah pusat informasi resmi yang dikelola oleh Dinas Kebudayaan dan Pariwisata Kota Bandung. Kami hadir untuk membantu wisatawan mendapatkan informasi akurat mengenai destinasi wisata, jadwal event, kuliner, hingga bantuan darurat selama berada di Bandung."
  },
  {
    question: "Di mana lokasi kantor fisik TIC Bandung?",
    answer: "Kantor utama kami terletak di jantung kota, yaitu di Jl. Asia Afrika No. 1, tepat di sekitar kawasan bersejarah Alun-Alun dan Gedung Merdeka. Kami buka setiap hari mulai pukul 08:00 WIB hingga 16:00 WIB."
  },
  {
    question: "Bagaimana cara menuju ke Bandung menggunakan transportasi umum?",
    answer: "Kota Bandung sangat mudah diakses! Anda bisa menggunakan Kereta Cepat Whoosh (berhenti di Padalarang/Tegalluar), Kereta Api Reguler ke Stasiun Bandung, atau menggunakan Travel dan Bus Antar Kota yang memiliki banyak titik pemberhentian di pusat kota."
  },
  {
    question: "Apakah TIC menyediakan layanan pemandu wisata (Tour Guide)?",
    answer: "Kami tidak secara langsung menyediakan pemandu wisata privat, namun kami memiliki program Walking Tour reguler dan dapat merekomendasikan layanan agen perjalanan terpercaya (ASITA/ASTINDO) yang bermitra resmi dengan Pemerintah Kota Bandung."
  },
  {
    question: "Apa yang harus dilakukan jika mengalami keadaan darurat medis atau keamanan?",
    answer: "Jangan panik. Anda dapat langsung menghubungi layanan darurat terpadu di 112 (Bebas Pulsa), Polisi 110, atau Ambulans 119. Anda juga bisa menggunakan tombol WhatsApp Darurat di pojok kanan bawah halaman ini agar tim TIC dapat memandu Anda."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-slate-50 relative z-10">
      <div className="py-16 md:py-24 px-4 md:px-8 lg:px-10 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="md:w-1/3">
          <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">Bantuan Pintar</span>
          <h2 className="font-headline-lg text-[36px] md:text-[56px] font-black text-[#1A1A1A] uppercase tracking-widest leading-[1.1] mb-6">Tanya<br/>Jawab</h2>
          <p className="text-on-surface-variant font-body-md leading-relaxed text-sm md:text-base">
            Temukan jawaban untuk pertanyaan yang paling sering diajukan oleh para pelancong tentang pesona Kota Bandung.
          </p>
        </div>

        <div className="md:w-2/3 flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white border transition-all duration-300 rounded-[2px] overflow-hidden ${
                  isOpen ? 'border-[#00C853] shadow-[0_8px_30px_rgba(0,200,83,0.12)]' : 'border-outline-variant/40 hover:border-outline-variant'
                }`}
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-transparent outline-none focus:outline-none"
                >
                  <h3 className={`font-headline-sm text-lg md:text-xl font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-[#00C853]' : 'text-on-surface'}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-[2px] border transition-all duration-300 ${isOpen ? 'bg-[#00C853] border-[#00C853] text-white' : 'border-outline-variant text-on-surface-variant'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={`px-6 md:px-8 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                >
                  <p className="text-on-surface-variant font-body-md leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
