
import BeritaForm from "@/components/admin/cms/BeritaForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Tambah Berita Baru | Admin TIC Kota Bandung",
};

export default function NewBeritaPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <Link 
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Berita
        </Link>
        <h1 className="text-3xl font-bold font-display text-[#1b1c1a] mb-2">Tambah Berita Baru</h1>
        <p className="text-[#4f4635]">Isi formulir di bawah untuk mendaftarkan berita atau artikel baru.</p>
      </div>

      <BeritaForm />
    </div>
  );
}
