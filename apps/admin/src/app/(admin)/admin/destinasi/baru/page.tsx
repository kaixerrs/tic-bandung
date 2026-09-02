import DestinationForm from "@/components/admin/DestinationForm";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tambah Destinasi Baru | Admin TIC Kota Bandung",
};

export default async function NewDestinationPage() {
  const supabase = await createClient();
  
  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <>
      <div className="w-full">
        <div className="mb-8">
          <Link 
          href="/admin/destinasi"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Destinasi
        </Link>
        <h1 className="text-3xl font-bold font-display text-[#1b1c1a] mb-2">Tambah Destinasi Baru</h1>
          <p className="text-[#4f4635]">Isi formulir di bawah untuk mendaftarkan destinasi wisata baru ke dalam sistem.</p>
        </div>

        <DestinationForm categories={categories || []} />
      </div>
    </>
  );
}
