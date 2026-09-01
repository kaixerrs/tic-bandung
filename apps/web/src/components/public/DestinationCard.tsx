import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

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
}

export default function DestinationCard({ destination }: { destination: DestinationProps }) {
  const imageUrl = destination.image_url || 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=800&auto=format&fit=crop'; // Placeholder

  return (
    <Link href={`/destinasi/${destination.slug}`} className="block group h-full">
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
          
          {destination.district && (
            <div className="flex items-start gap-1 mb-3 text-[#4f4635] text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C9971E]" />
              <span className="line-clamp-2">{destination.district}</span>
            </div>
          )}
          
          {destination.description && (
            <p className="text-[#4f4635] text-sm line-clamp-3 mb-4 flex-grow">
              {destination.description}
            </p>
          )}

          {/* Footer Metadata (FR-05 & NFR-09) */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#f6f3f0]">
            
            {/* Logic NFR-09: Tiga state harga */}
            {destination.ticket_type !== 'UNCONFIRMED' ? (
              <span className="font-bold text-sm text-[#3D7A5E]">
                {destination.ticket_type === 'FREE' ? 'Gratis' : 
                 destination.ticket_nominal ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(destination.ticket_nominal) : 
                 'Berbayar'}
              </span>
            ) : (
              <span></span> /* Empty span to keep flex-between layout if no price */
            )}
            
            {/* If operating_hours exists, show it */}
            {destination.operating_hours && (
              <div className="flex items-center gap-1.5 text-[#4f4635] text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Ada</span> {/* Or parse JSON to show open status */}
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
