"use client";

import dynamic from 'next/dynamic';

const DestinationMap = dynamic(() => import('./DestinationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center text-white/50">Memuat Peta...</div>
});

export default function DestinationMapWrapper(props: any) {
  return <DestinationMap {...props} />;
}
