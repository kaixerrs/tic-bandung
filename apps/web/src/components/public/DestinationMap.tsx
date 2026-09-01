"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface DestinationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  name: string;
}

export default function DestinationMap({ latitude, longitude, name }: DestinationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-100 animate-pulse rounded-sm flex items-center justify-center text-text-muted">Memuat peta...</div>;
  }

  // Default to Bandung center if no coordinates
  const lat = latitude || -6.9175;
  const lng = longitude || 107.6191;

  return (
    <div className="w-full h-full rounded-sm overflow-hidden shadow-soft border border-gray-100">
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <div className="font-bold text-text-primary">{name}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
