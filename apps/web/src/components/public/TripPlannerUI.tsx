"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Map, MapPin, Clock, ArrowRight, Compass, Camera, Palette } from 'lucide-react';
import Image from 'next/image';

// Data statis Itinerary 3H2M (FR-10)
const getItineraries = (locale: string) => [
  {
    id: 'heritage',
    title: 'Bandung Heritage',
    icon: Compass,
    color: '#C9971E',
    description: `${locale === 'en' ? "Explore the time machine across colonial traces and historical architecture in the heart of Bandung City." : "Jelajahi mesin waktu melintasi jejak kolonial dan arsitektur bersejarah di jantung Kota Bandung."}`,
    image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=1200',
    days: [
      {
        day: `${locale === 'en' ? "Day 1" : "Hari Pertama"}`,
        title: `${locale === 'en' ? "City Heart & Point Zero" : "Jantung Kota & Titik Nol"}`,
        activities: [
          { time: '09:00', title: `${locale === 'en' ? "Braga & Asia Afrika Street" : "Jalan Braga & Asia Afrika"}`, desc: `${locale === 'en' ? "Enjoy the morning walking across Dutch colonial Art Deco buildings." : "Menikmati pagi dengan berjalan kaki melintasi gedung-gedung Art Deco peninggalan Belanda."}`, slug: 'braga' },
          { time: '13:00', title: `${locale === 'en' ? "Asian-African Conference Museum" : "Museum Konferensi Asia Afrika"}`, desc: `${locale === 'en' ? "Dive into the history of the unity of Asian and African nations." : "Menyelami sejarah persatuan bangsa-bangsa Asia dan Afrika."}`, slug: 'museum-konferensi-asia-afrika' },
          { time: '16:00', title: `${locale === 'en' ? "Bandung Square & Grand Mosque" : "Alun-Alun Bandung & Masjid Raya"}`, desc: `${locale === 'en' ? "Relax in the afternoon on the synthetic grass of Bandung City Square." : "Bersantai sore di rumput sintetis Alun-Alun Kota Bandung."}`, slug: 'alun-alun-bandung' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 2" : "Hari Kedua"}`,
        title: `${locale === 'en' ? "Silent Witness of History" : "Saksi Bisu Sejarah"}`,
        activities: [
          { time: '09:00', title: `${locale === 'en' ? "Gedung Sate" : "Gedung Sate"}`, desc: `${locale === 'en' ? "Bandung city icon with a blend of European and Archipelago architecture." : "Ikon kota Bandung dengan arsitektur perpaduan Eropa dan Nusantara."}`, slug: 'gedung-sate' },
          { time: '13:00', title: `${locale === 'en' ? "Geological Museum" : "Museum Geologi"}`, desc: `${locale === 'en' ? "Learn about earth history, dinosaur fossils, and the geological formation of the Bandung basin." : "Mempelajari sejarah bumi, fosil dinosaurus, dan formasi geologi cekungan Bandung."}`, slug: 'museum-geologi' },
          { time: '16:00', title: `${locale === 'en' ? "People's Struggle Monument" : "Monumen Perjuangan Rakyat"}`, desc: `${locale === 'en' ? "Historical monument with reliefs of the struggle of the West Java people." : "Tugu bersejarah dengan relief perjuangan rakyat Jawa Barat."}`, slug: 'monju' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 3" : "Hari Ketiga"}`,
        title: `${locale === 'en' ? "Closing Nostalgia" : "Nostalgia Penutup"}`,
        activities: [
          { time: '10:00', title: `${locale === 'en' ? "Bandung History Park" : "Taman Sejarah Bandung"}`, desc: `${locale === 'en' ? "Thematic park telling the story of important figures of Bandung City." : "Taman tematik yang menceritakan tokoh-tokoh penting Kota Bandung."}`, slug: 'taman-sejarah' },
          { time: '12:00', title: `${locale === 'en' ? "Legendary Braga Culinary" : "Kuliner Legendaris Braga"}`, desc: `${locale === 'en' ? "Lunch before returning to your hometown." : "Makan siang sebelum kembali ke kota asal."}`, slug: 'kopi-aroma' }
        ]
      }
    ]
  },
  {
    id: 'nature',
    title: 'Escape to Nature',
    icon: Camera,
    color: '#3D7A5E',
    description: `${locale === 'en' ? "Get away from the hustle and bustle of the city and absorb the coolness of Bandung's mountain nature." : "Menjauh sejenak dari hiruk pikuk kota dan meresapi kesejukan alam pegunungan Bandung."}`,
    image: 'https://images.unsplash.com/photo-1555018617-1fdf5b1ceeb1?q=80&w=1200',
    days: [
      {
        day: `${locale === 'en' ? "Day 1" : "Hari Pertama"}`,
        title: `${locale === 'en' ? "Coolness of North Bandung" : "Sejuknya Bandung Utara"}`,
        activities: [
          { time: '08:00', title: `${locale === 'en' ? "Tahura Ir. H. Djuanda" : "Tahura Ir. H. Djuanda"}`, desc: `${locale === 'en' ? "Morning trekking enjoying the pine forest and Dutch & Japanese Caves." : "Trekking pagi menikmati hutan pinus dan Goa Belanda & Jepang."}`, slug: 'tahura' },
          { time: '12:00', title: `${locale === 'en' ? "Keraton Cliff" : "Tebing Keraton"}`, desc: `${locale === 'en' ? "Incredible view of the Lembang fault from a height." : "Pemandangan luar biasa patahan Lembang dari ketinggian."}`, slug: 'tebing-keraton' },
          { time: '15:00', title: `${locale === 'en' ? "Dago Waterfall" : "Curug Dago"}`, desc: `${locale === 'en' ? "Historical waterfall where Thai kings meditated." : "Air terjun historis tempat bertapanya raja-raja Thailand."}`, slug: 'curug-dago' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 2" : "Hari Kedua"}`,
        title: `${locale === 'en' ? "Open Space Exploration" : "Eksplorasi Ruang Terbuka"}`,
        activities: [
          { time: '09:00', title: `${locale === 'en' ? "Babakan Siliwangi Forest Park" : "Taman Hutan Babakan Siliwangi"}`, desc: `${locale === 'en' ? "Walk on the longest Forest Walk in Southeast Asia." : "Berjalan di Forest Walk terpanjang di Asia Tenggara."}`, slug: 'baksil' },
          { time: '13:00', title: `${locale === 'en' ? "Cikapundung Terrace" : "Teras Cikapundung"}`, desc: `${locale === 'en' ? "Relax by the river with an amphitheater concept." : "Bersantai di pinggir sungai dengan konsep amphitheater."}`, slug: 'teras-cikapundung' },
          { time: '16:00', title: `${locale === 'en' ? "Lansia Park & Cisangkuy" : "Taman Lansia & Cisangkuy"}`, desc: `${locale === 'en' ? "Relaxing afternoon accompanied by cool air and horseback riding." : "Sore santai ditemani udara sejuk dan kuda tunggang."}`, slug: 'taman-lansia' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 3" : "Hari Ketiga"}`,
        title: `${locale === 'en' ? "City Greening" : "Penghijauan Kota"}`,
        activities: [
          { time: '09:00', title: `${locale === 'en' ? "Bandung Zoo" : "Bandung Zoo (Kebun Binatang)"}`, desc: `${locale === 'en' ? "Interact with animals under the shade of big trees." : "Interaksi dengan satwa di bawah rimbunnya pohon besar."}`, slug: 'bandung-zoo' },
          { time: '13:00', title: `${locale === 'en' ? "City Hall Park" : "Taman Balai Kota"}`, desc: `${locale === 'en' ? "Thematic park in the government center before going home." : "Taman tematik di pusat pemerintahan sebelum pulang."}`, slug: 'taman-balai-kota' }
        ]
      }
    ]
  },
  {
    id: 'creative',
    title: 'Art & Creative',
    icon: Palette,
    color: '#2C7A7A',
    description: `${locale === 'en' ? "Dive into the creative pulse of Bandung youth through art spaces and creative villages." : "Menyelami urat nadi kreativitas anak muda Bandung melalui art space dan kampung kreatif."}`,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200',
    days: [
      {
        day: `${locale === 'en' ? "Day 1" : "Hari Pertama"}`,
        title: `${locale === 'en' ? "Modern Art Exploration" : "Eksplorasi Seni Modern"}`,
        activities: [
          { time: '10:00', title: `${locale === 'en' ? "NuArt Sculpture Park" : "NuArt Sculpture Park"}`, desc: `${locale === 'en' ? "Gallery of I Nyoman Nuarta's sculpture artwork in the middle of a green park." : "Galeri karya seni patung I Nyoman Nuarta di tengah taman hijau."}`, slug: 'nuart' },
          { time: '14:00', title: `${locale === 'en' ? "Selasar Sunaryo Art Space" : "Selasar Sunaryo Art Space"}`, desc: `${locale === 'en' ? "Aesthetic contemporary art gallery in Dago Pakar." : "Galeri seni kontemporer di Dago Pakar yang estetik."}`, slug: 'selasar-sunaryo' },
          { time: '17:00', title: `${locale === 'en' ? "Bukit Bintang / Upper Dago" : "Bukit Bintang / Dago Atas"}`, desc: `${locale === 'en' ? "Dinner with a view of Bandung city lights." : "Makan malam dengan pemandangan lampu kota Bandung."}`, slug: 'bukit-bintang' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 2" : "Hari Kedua"}`,
        title: `${locale === 'en' ? "Local Products & Crafts" : "Produk Lokal & Kriya"}`,
        activities: [
          { time: '10:00', title: `${locale === 'en' ? "Binong Jati Knitting Center" : "Sentra Rajut Binong Jati"}`, desc: `${locale === 'en' ? "See firsthand the process of making typical Bandung knits." : "Melihat langsung proses pembuatan rajut khas Bandung."}`, slug: 'binong-jati' },
          { time: '13:00', title: `${locale === 'en' ? "Saung Angklung Udjo" : "Saung Angklung Udjo"}`, desc: `${locale === 'en' ? "Interactive angklung performance and Sundanese culture." : "Pertunjukan angklung interaktif dan kebudayaan Sunda."}`, slug: 'saung-udjo' },
          { time: '16:00', title: `${locale === 'en' ? "Cihampelas Walk" : "Cihampelas Walk"}`, desc: `${locale === 'en' ? "Afternoon stroll in a shopping center with a semi-outdoor concept." : "Jalan-jalan sore di pusat belanja dengan konsep semi-outdoor."}`, slug: 'ciwalk' }
        ]
      },
      {
        day: `${locale === 'en' ? "Day 3" : "Hari Ketiga"}`,
        title: `${locale === 'en' ? "Shoe Center Tourism" : "Wisata Sentra Sepatu"}`,
        activities: [
          { time: '09:00', title: `${locale === 'en' ? "Cibaduyut Shoe Center" : "Sentra Sepatu Cibaduyut"}`, desc: `${locale === 'en' ? "Shop for leather products and local handmade shoes." : "Belanja produk kulit dan sepatu buatan tangan lokal."}`, slug: 'cibaduyut' },
          { time: '13:00', title: `${locale === 'en' ? "Pasteur Souvenir Center" : "Pusat Oleh-Oleh Pasteur"}`, desc: `${locale === 'en' ? "Buy souvenirs before leaving Bandung." : "Membeli buah tangan sebelum meninggalkan Bandung."}`, slug: 'pasteur' }
        ]
      }
    ]
  }
];

export default function TripPlannerUI() {
  const locale = useLocale();
  const l = (id: string, en: string) => locale === 'en' ? en : id; 
  const t = useTranslations('TripPlanner');
  const ITINERARIES = getItineraries(locale);
  const [activeTab, setActiveTab] = useState(ITINERARIES[0].id);

  const activeItinerary = ITINERARIES.find(i => i.id === activeTab) || ITINERARIES[0];

  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      
      {/* Header Section */}
      <div className="bg-[#1b1c1a] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none"></div>
        <Image
          src={activeItinerary.image}
          alt="{activeItinerary.title} Cover"
          fill
          className="object-cover opacity-40 transition-opacity duration-1000"
          priority
        />
        
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
            <Map className="w-4 h-4" /> {l('Itinerary Builder 3D2N', '3D2N Itinerary Builder')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            Rencana Perjalanan
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {l('Tidak perlu bingung menyusun jadwal. Pilih tema wisata Anda dan ikuti rekomendasi rute 3 Hari 2 Malam (3D2N) terbaik di Bandung.', 'No need to get confused planning your schedule. Choose your tour theme and follow the best 3 Days 2 Nights (3D2N) route recommendations in Bandung.')}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-8 relative z-30 mb-20">
        
        {/* Theme Selector (Tabs) */}
        <div className="bg-white rounded-sm shadow-xl p-2 md:p-4 border border-[#d3c5af]/50 flex flex-col md:flex-row gap-2 mb-12">
          {ITINERARIES.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 md:py-5 px-4 rounded-xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'text-white shadow-md transform scale-[1.02]' 
                    : 'text-[#4f4635] hover:bg-[#f6f3f0]'
                }`}
                style={{ backgroundColor: isActive ? item.color : 'transparent' }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#4f4635]'}`} />
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Active Itinerary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white p-8 rounded-sm shadow-sm border border-[#d3c5af]/50">
              <div 
                className="w-16 h-16 rounded-sm flex items-center justify-center mb-6 text-white shadow-inner"
                style={{ backgroundColor: activeItinerary.color }}
              >
                <activeItinerary.icon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-[#1b1c1a] mb-4">
                {activeItinerary.title}
              </h2>
              <p className="text-[#4f4635] leading-relaxed mb-6">
                {activeItinerary.description}
              </p>
              
              <div className="pt-6 border-t border-[#f6f3f0] flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold text-[#1b1c1a]">
                  <span>{l('Durasi:', 'Duration:')}</span>
                  <span>{l('3 Hari 2 Malam', '3 Days 2 Nights')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1b1c1a]">
                  <span>{l('Total Destinasi:', 'Total Destinations:')}</span>
                  <span>{activeItinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} {l('Tempat', 'Places')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Timeline Vertical */}
          <div className="lg:col-span-8">
            <div className="space-y-12">
              {activeItinerary.days.map((day, dayIndex) => (
                <div key={dayIndex} className="relative">
                  {/* Day Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div 
                      className="text-white font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider"
                      style={{ backgroundColor: activeItinerary.color }}
                    >
                      {day.day}
                    </div>
                    <h3 className="text-xl font-bold text-[#1b1c1a]">{day.title}</h3>
                  </div>

                  {/* Timeline Line (Background) */}
                  <div className="absolute left-[27px] top-[60px] bottom-0 w-0.5 bg-gray-200"></div>

                  {/* Activities List */}
                  <div className="space-y-8 pl-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="relative flex gap-6 group">
                        
                        {/* Timeline Dot & Time */}
                        <div className="flex flex-col items-center gap-2 mt-1 relative z-10 shrink-0">
                          <div 
                            className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                            style={{ backgroundColor: activeItinerary.color }}
                          >
                            <Clock className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-[#4f4635] bg-white px-1">
                            {activity.time}
                          </span>
                        </div>

                        {/* Activity Card */}
                        <Link href={`/destinasi/${activity.slug}`} className="flex-1 bg-white p-6 rounded-sm shadow-[0_4px_20px_rgba(42,42,40,0.04)] border border-[#d3c5af]/30 hover:border-[#C9971E] hover:shadow-[0_8px_30px_rgba(42,42,40,0.08)] transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center cursor-pointer group/card">
                          <div>
                            <h4 className="text-lg font-bold text-[#1b1c1a] mb-2 group-hover/card:text-[#7a5900] transition-colors">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-[#4f4635] leading-relaxed">
                              {activity.desc}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover/card:bg-[#C9971E]/10 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover/card:text-[#C9971E] transition-colors" />
                          </div>
                        </Link>
                        
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
