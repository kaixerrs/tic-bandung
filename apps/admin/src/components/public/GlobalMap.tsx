"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

interface MapDestination {
  id: string;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  category?: { name: string; cluster_color: string } | null;
  region?: { name: string } | null;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface GlobalMapProps {
  destinations: MapDestination[];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function GlobalMap({ destinations }: GlobalMapProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [activeDest, setActiveDest] = useState<MapDestination | null>(null);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center">Memuat Peta Interaktif...</div>;
  }

  // Default center of Bandung
  const defaultCenter: [number, number] = [-6.9175, 107.6191];

  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex">
      {/* Sidebar Overlay (Desktop) or Bottom Sheet (Mobile) */}
      <div className="absolute top-4 left-4 z-[400] w-[350px] bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        <div className="p-4 bg-primary text-white font-bold text-lg">
          Peta Interaktif Bandung
        </div>
        <div className="p-4 border-b border-gray-100 text-sm text-text-muted">
          Menampilkan {destinations.length} destinasi wisata yang ada di Kota Bandung.
        </div>
        <div className="overflow-y-auto flex-grow hide-scrollbar p-2">
          {destinations.map(dest => (
            <div 
              key={dest.id}
              onClick={() => setActiveDest(dest)}
              className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${activeDest?.id === dest.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
            >
              <h3 className="font-bold text-text-primary text-sm mb-1">{dest.name}</h3>
              {dest.category && (
                 <span 
                   className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded text-white"
                   style={{ backgroundColor: dest.category.cluster_color }}
                 >x
                   {dest.category.name}
                 </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full z-0 relative">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeDest && activeDest.latitude && activeDest.longitude && (
             <MapUpdater center={[activeDest.latitude, activeDest.longitude]} />
          )}

          {destinations.map(dest => {
            if (!dest.latitude || !dest.longitude) return null;
            return (
              <Marker 
                key={dest.id} 
                position={[dest.latitude, dest.longitude]} 
                icon={icon}
                eventHandlers={{
                  click: () => setActiveDest(dest)
                }}
              >
                <Popup>
                  <div className="text-center w-48">
                    <h3 className="font-bold text-text-primary mb-1">{dest.name}</h3>
                    {dest.region && <p className="text-xs text-text-muted mb-3">{dest.region.name}</p>}
                    <Link 
                      href={`/destinasi/${dest.slug}`}
                      className="block w-full bg-primary text-white text-xs font-bold py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  );
}
