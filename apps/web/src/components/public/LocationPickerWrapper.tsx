"use client";

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => <div className="w-full h-80 bg-gray-100 animate-pulse flex items-center justify-center font-medium text-gray-500 rounded-sm border border-gray-200">Memuat Peta Interaktif...</div>
});

export default function LocationPickerWrapper(props: any) {
  return <LocationPickerMap {...props} />;
}