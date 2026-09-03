import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

interface DestinationProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  district: string | null;
  category?: { color_cluster: string, name: string } | null;
  image_url: string | null;
  ticket_type: 'FREE' | 'PAID' | 'UNCONFIRMED';
  ticket_nominal: number | null;
  operating_hours: string | null;
  leaflet_url?: string | null;
}

export default function DestinationCard({ destination }: { destination: DestinationProps }) {
  const t = useTranslations('Components');
  const locale = useLocale();
  const imageUrl = destination.image_url || 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=800&auto=format&fit=crop'; // Placeholder

  const innerContent = (
    <div className="bg-white rounded-sm border border-[#d3c5af]/50 shadow-[0_4px_20px_rgba(42,42,40,0.04)] overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(42,42,40,0.08)]">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Conditional rendering for Category Badge */}
        {destination.category && (
          <div className="mb-3">
            <span 
              className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md text-white"
              style={{ 
                backgroundColor: 
                  destination.category.color_cluster === 'green' ? '#3D7A5E' : 
                  destination.category.color_cluster === 'gold' ? '#C9971E' :
                  destination.category.color_cluster === 'blue' ? '#2C5C8A' :
                  destination.category.color_cluster === 'teal' ? '#2C7A7A' : '#4f4635'
              }}
            >
              {destination.category.name}
            </span>
          </div>
        )}
        
        <h3 className="font-display text-lg font-bold text-[#1b1c1a] mb-1 line-clamp-1 group-hover:text-[#7a5900] transition-colors">
          {destination.name}
        </h3>
      </div>
    </div>
  );

  if (destination.leaflet_url) {
    return (
      <a href={destination.leaflet_url} target="_blank" rel="noopener noreferrer" className="block group h-full cursor-pointer">
        {innerContent}
      </a>
    );
  }

  return (
    <div className="block group h-full opacity-70" title="Brosur digital sedang dipersiapkan">
      {innerContent}
    </div>
  );
}
