"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface DestinationPoint {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  district: string | null;
  ticket_type: 'FREE' | 'PAID' | 'UNCONFIRMED';
  ticket_nominal: number | null;
  category: { name: string; color_cluster: string };
  image_url: string | null;
}

// Function to generate dynamic SVG marker based on cluster color
const createCustomIcon = (clusterColor: string) => {
  let hexColor = '#4f4635'; // Default dark brown
  if (clusterColor === 'green') hexColor = '#3D7A5E';
  if (clusterColor === 'gold') hexColor = '#C9971E';
  if (clusterColor === 'blue') hexColor = '#2C5C8A';
  if (clusterColor === 'teal') hexColor = '#2C7A7A';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${hexColor}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white" stroke="none"></circle>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-div-icon',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function MapClient({ destinations }: { destinations: DestinationPoint[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-[#f6f3f0] animate-pulse flex items-center justify-center">Memuat Peta...</div>;

  // Center on Bandung City
  const defaultCenter: [number, number] = [-6.914744, 107.609810];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        zoomControl={false} // We will add it manually for positioning
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="bottomleft" />

        {destinations.map((dest) => (
          <Marker 
            key={dest.id} 
            position={[dest.latitude, dest.longitude]} 
            icon={createCustomIcon(dest.category.color_cluster)}
          >
            <Popup className="destination-popup rounded-sm overflow-hidden p-0 border-0 shadow-lg">
              <div className="w-64">
                <div className="relative h-32 w-full bg-gray-100">
                  <Image
                    src={dest.image_url || 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=400'}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md text-white bg-black/50 backdrop-blur-sm">
                    {dest.category.name}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-[#1b1c1a] text-base mb-1 leading-tight line-clamp-1">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-[#4f4635] text-xs mb-3">
                    <MapPin className="w-3 h-3 text-[#C9971E]" />
                    <span>{dest.district || 'Bandung'}</span>
                  </div>

                  {dest.ticket_type !== 'UNCONFIRMED' && (
                    <div className="text-xs font-bold text-[#3D7A5E] mb-3">
                      {dest.ticket_type === 'FREE' ? 'Gratis' : 
                       dest.ticket_nominal ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dest.ticket_nominal) : 
                       'Berbayar'}
                    </div>
                  )}

                  <Link href={`/destinasi/${dest.slug}`} className="block w-full text-center bg-[#f6f3f0] hover:bg-[#eadecc] text-[#1b1c1a] text-xs font-bold py-2 rounded-sm transition-colors flex items-center justify-center gap-1 group">
                    Lihat Detail
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Global override for Leaflet Popup padding */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 1rem;
        }
        .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          padding: 8px 8px 0 0;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
