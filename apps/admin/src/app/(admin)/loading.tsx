import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 text-[#C9971E] animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Memuat data...</p>
    </div>
  );
}
