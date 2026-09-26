import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
      <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 text-[#C9971E] animate-spin" />
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Memuat data dari server...</p>
    </div>
  );
}
