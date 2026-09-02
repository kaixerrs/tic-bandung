"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Filter, Search, X } from 'lucide-react';
import DestinationCard from '@/components/public/DestinationCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useTranslations, useLocale } from 'next-intl';

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
  const t = useTranslations('UI');
  const tc = useTranslations('CategoryUI');
  const locale = useLocale();

  // Extract unique districts for the filter dropdown
  const uniqueDistricts = useMemo(() => {
    const districts = initialDestinations
      .map(d => d.district)
      .filter((d): d is string => typeof d === 'string' && d.trim() !== '');
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
        className="pt-16 md:pt-20 pb-12 lg:pb-16 relative overflow-hidden"
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

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <nav className="flex text-white/80 text-sm mb-6 items-center gap-2 font-medium">
            <Link className="hover:text-white transition-colors" href="/">{locale === 'en' ? 'Home' : 'Beranda'}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link className="hover:text-white transition-colors" href="/kategori">{locale === 'en' ? 'Category' : 'Kategori'}</Link>
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
            <p className="text-xl text-[#4f4635] mb-2">{tc('notFound')}</p>
            <p className="text-[#4f4635]/70">{tc('tryChange')}</p>
          </div>
        )}
      </div>
    </main>
  );
}

