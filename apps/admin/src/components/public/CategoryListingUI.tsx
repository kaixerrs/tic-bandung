"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Filter, Search, X } from 'lucide-react';
import DestinationCard from '@/components/public/DestinationCard';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  district: string | null;
  ticket_type: 'FREE' | 'PAID' | 'UNCONFIRMED';
  ticket_nominal: number | null;
  operating_hours: string | null;
  destination_images: { image_url: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  cluster_color?: string | null;
  color_cluster: string;
}

export default function CategoryListingUI({
  category,
  initialDestinations,
}: {
  category: Category;
  initialDestinations: Destination[];
}) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<'FREE' | 'PAID' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique districts for the filter dropdown
  const uniqueDistricts = useMemo(() => {
    const districts = initialDestinations
      .map(d => d.district)
      .filter((d): d is string => d !== null && d.trim() !== '');
    return Array.from(new Set(districts)).sort();
  }, [initialDestinations]);

  // Filter logic (Client Side for speed - FR-03)
  const filteredDestinations = useMemo(() => {
    return initialDestinations.filter(dest => {
      const matchDistrict = selectedDistrict ? dest.district === selectedDistrict : true;
      const matchPrice = selectedPrice ? dest.ticket_type === selectedPrice : true;
      const matchSearch = searchQuery 
        ? dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (dest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        : true;
      
      return matchDistrict && matchPrice && matchSearch;
    });
  }, [initialDestinations, selectedDistrict, selectedPrice, searchQuery]);

  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      {/* Header Banner - Hero Image with Parallax & Gradient */}
      <div 
        className="pt-32 pb-24 relative overflow-hidden"
      >
        {category.image_url ? (
          <>
            <img 
              src={category.image_url} 
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </>
        ) : (
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ 
              backgroundColor: category.cluster_color || '#4f4635'
            }}
          >
            {/* Top Right Abstract Overlay */}
            <div className="absolute -top-64 -right-64 w-[800px] h-[800px] bg-white opacity-[0.03] rounded-full"></div>
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] border border-white opacity-[0.06] rounded-full"></div>
            <div className="absolute -top-16 -right-16 w-[400px] h-[400px] border border-white opacity-[0.1] rounded-full"></div>

            {/* Bottom Left Decorative Grid/Dots */}
            <svg className="absolute -bottom-16 -left-16 w-80 h-80 text-white opacity-[0.05]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100" height="100" fill="url(#dots)" />
            </svg>
            
            {/* Dynamic Geometric Orbs for Lighting */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/40 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4"></div>
            
            {/* Elegant dark gradient from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          </div>
        )}

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 mt-10">
          <nav className="flex text-white/80 text-sm mb-6 items-center gap-2 font-medium">
            <Link className="hover:text-white transition-colors" href="/">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <Link className="hover:text-white transition-colors" href="/kategori">Kategori</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 tracking-tight drop-shadow-md">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-sm font-medium">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Filter Bar (FR-03) */}
        <div className="bg-white p-4 rounded-sm shadow-sm border border-[#d3c5af]/50 mb-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between sticky top-[80px] z-40">
          
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7a5900] focus:ring-1 focus:ring-[#7a5900] outline-none transition-all text-[#1b1c1a]" 
              placeholder="Cari nama destinasi..." 
              type="text" 
            />
          </div>

          <div className="flex flex-row gap-2 md:gap-3 w-full md:w-auto">
            <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1 md:w-auto">
              <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2">
                <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                <CustomSelect 
                  value={selectedDistrict || ''} 
                  onChange={(e) => setSelectedDistrict(e.target.value || null)}
                  className="bg-transparent border-none font-medium !p-0 w-full min-w-[10px]"
                  wrapperClassName="flex-1 min-w-0"
                  placeholder="Kawasan"
                  options={uniqueDistricts.map(d => ({ label: d, value: d }))}
                />
              </div>

              <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2">
                <span className="text-[#3D7A5E] font-bold text-sm shrink-0">Rp</span>
                <CustomSelect 
                  value={selectedPrice || ''} 
                  onChange={(e) => setSelectedPrice(e.target.value as 'FREE' | 'PAID' | null)}
                  className="bg-transparent border-none font-medium !p-0 w-full min-w-[10px]"
                  wrapperClassName="flex-1 min-w-0"
                  placeholder="Harga"
                  options={[
                    { label: 'Gratis', value: 'FREE' },
                    { label: 'Berbayar', value: 'PAID' }
                  ]}
                />
              </div>
            </div>

            {(selectedDistrict || selectedPrice || searchQuery) && (
              <button 
                onClick={() => {
                  setSelectedDistrict(null);
                  setSelectedPrice(null);
                  setSearchQuery('');
                }}
                className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                title="Reset Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-[#4f4635] font-medium">
          Menampilkan <span className="text-[#1b1c1a] font-bold">{filteredDestinations.length}</span> destinasi
        </div>

        {/* Grid Layout (NFR-23 Reusability) */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredDestinations.map((dest) => (
              <DestinationCard 
                key={dest.id} 
                destination={{
                  id: dest.id,
                  name: dest.name,
                  slug: dest.slug,
                  description: dest.description,
                  district: dest.district,
                  category: {
                    name: category.name,
                    color_cluster: category.color_cluster
                  },
                  image_url: dest.destination_images?.[0]?.image_url || null,
                  ticket_type: dest.ticket_type,
                  ticket_nominal: dest.ticket_nominal,
                  operating_hours: dest.operating_hours
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-sm border border-dashed border-[#d3c5af]">
            <p className="text-xl text-[#4f4635] mb-2">Pencarian Tidak Ditemukan</p>
            <p className="text-[#4f4635]/70">Coba ubah kata kunci atau hapus filter kawasan/harga.</p>
          </div>
        )}
      </div>
    </main>
  );
}
