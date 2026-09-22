"use client";
import { toast } from 'react-hot-toast';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Search } from 'lucide-react';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

interface LocationInfo {
  lat: number;
  lng: number;
  country: string;
  province: string;
  city: string;
  district: string;
  village: string;
}

interface LocationPickerProps {
  onLocationChange: (loc: LocationInfo) => void;
  isActive?: boolean;
}

function LocationMarker({ position, setPosition, setAddressInfo, isActive }: any) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        if (map && (map as any)._container) {
          try { map.invalidateSize(); } catch(e) {}
        }
      }, 100);
    }
  }, [map, isActive]);



  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.address) {
        setAddressInfo({
          country: data.address.country || '',
          province: data.address.state || data.address.region || '',
          city: data.address.city || data.address.municipality || data.address.town || data.address.county || '',
          district: data.address.suburb || data.address.neighbourhood || '',
          village: data.address.village || data.address.hamlet || ''
        });
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  useEffect(() => {
    if (position && !map.getBounds().contains(position)) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={icon} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          fetchAddress(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export default function LocationPickerMap({ onLocationChange, isActive }: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [addressInfo, setAddressInfo] = useState({ country: '', province: '', city: '', district: '', village: '' });


  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2 && showSuggestions) {
        setIsSearching(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setSuggestions(data);
            }
          })
          .catch(err => console.error(err))
          .finally(() => setIsSearching(false));
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showSuggestions]);

  const handleSelectSuggestion = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setPosition({ lat, lng });
    setSearchQuery(place.display_name);
    setShowSuggestions(false);
    
    if (place.address) {
      setAddressInfo({
        country: place.address.country || '',
        province: place.address.state || place.address.region || '',
        city: place.address.city || place.address.town || place.address.county || '',
        district: place.address.suburb || place.address.neighbourhood || '',
        village: place.address.village || place.address.hamlet || ''
      });
    }
  };
  
  useEffect(() => {
    if (position) {
      onLocationChange({
        lat: position.lat,
        lng: position.lng,
        ...addressInfo
      });
    }
  }, [position, addressInfo, onLocationChange]);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // Reverse geocode
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=18&addressdetails=1`)
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                setAddressInfo({
                  country: data.address.country || '',
                  province: data.address.state || data.address.region || '',
                  city: data.address.city || data.address.town || data.address.county || '',
                  district: data.address.suburb || data.address.neighbourhood || '',
                  village: data.address.village || data.address.hamlet || ''
                });
              }
            })
            .finally(() => setIsSearching(false));
        },
        (error) => {
          setIsSearching(false);
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Akses lokasi otomatis terblokir. Klik ikon gembok di sebelah URL bar (kiri atas) lalu setel 'Lokasi' ke 'Allow/Izinkan'.", { duration: 6000 });
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            toast.error("Sinyal GPS tidak tersedia atau dimatikan oleh sistem operasi Windows Anda.", { duration: 6000 });
          } else if (error.code === error.TIMEOUT) {
            toast.error("Waktu pencarian lokasi habis (Timeout).", { duration: 4000 });
          } else {
            toast.error("Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.");
          }
          console.error("GPS Error:", error.message, error.code);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Browser Anda tidak mendukung fitur lokasi GPS.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full h-80 rounded-sm overflow-hidden border border-gray-200">
        <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2 pointer-events-none">
          <div className="w-full max-w-[200px] sm:max-w-[256px] pointer-events-auto">
          <div className="bg-white rounded-sm shadow-md flex items-center p-2 w-full">
            <Search className="w-4 h-4 text-gray-400 mr-2 cursor-pointer" onClick={(e: any) => handleSearch(e)} />
            <input 
              type="text" 
              placeholder="Cari tempat atau alamat" 
              className="flex-1 outline-none text-sm bg-transparent text-gray-800"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch(e);
                }
              }}
            />
          </div>
          
          {showSuggestions && (searchQuery.length > 2) && (
            <div className="mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-48 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-500 text-center">Mencari...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((place, idx) => (
                  <div 
                    key={idx} 
                    onClick={(e) => { e.stopPropagation(); handleSelectSuggestion(place); }}
                    className="p-3 text-xs text-gray-700 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    {place.display_name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">Tidak ditemukan</div>
              )}
            </div>
          )}
          </div>
          
          <button 
            type="button" 
            onClick={handleMyLocation}
            disabled={isSearching}
            className="pointer-events-auto bg-[#1e2a3b] hover:bg-[#2c3e50] disabled:bg-gray-400 text-white rounded-sm shadow-md flex items-center gap-2 px-3 py-2 text-sm transition-colors whitespace-nowrap h-9 shrink-0 ml-auto"
          >
            <Navigation className={`w-4 h-4 ${isSearching ? 'animate-pulse' : ''}`} /> 
            {isSearching ? 'Mencari...' : 'Lokasi Saya'}
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-top.leaflet-left {
            top: auto !important;
            bottom: 20px !important;
          }
        `}} />
        {isMounted && (
        <MapContainer center={[-6.9147, 107.6098]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 100 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} setAddressInfo={setAddressInfo} isActive={isActive} />
        </MapContainer>
        )}
        
        {position && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-white px-4 py-2 rounded-full shadow-md text-xs font-mono text-gray-700 flex items-center gap-2">
            <MapPin className="w-3 h-3 text-red-500" />
            {position.lat.toFixed(4)} S, {position.lng.toFixed(4)} E
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">Klik pada peta atau drag marker untuk menentukan lokasi event. Gunakan search box untuk mencari alamat atau klik &quot;Lokasi Saya&quot; untuk menggunakan GPS. Lokasi akan otomatis mengisi negara, provinsi, kota, kecamatan, dan desa.</p>
    </div>
  );
}