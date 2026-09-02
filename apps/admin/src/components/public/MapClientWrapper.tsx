"use client";

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f6f3f0] animate-pulse flex items-center justify-center font-medium text-[#4f4635]">Memuat Peta Interaktif...</div>
});

export default function MapClientWrapper(props: any) {
  return <MapClient {...props} />;
}
