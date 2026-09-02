import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import DestinationForm from "@/components/admin/DestinationForm";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Edit Destinasi | TIC Kota Bandung',
};

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  // 2. Fetch destination data
  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !destination) {
    return <div className="p-8 text-red-500 font-mono whitespace-pre-wrap">
      Error: {JSON.stringify(error, null, 2)}
      <br/><br/>
      Destination: {JSON.stringify(destination, null, 2)}
      <br/><br/>
      ID: {id}
    </div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link 
          href="/admin/destinasi"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Destinasi
        </Link>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-[#C9971E]" />
          Edit Destinasi
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Perbarui informasi destinasi <span className="font-bold text-gray-900">{destination.name}</span>.
        </p>
      </div>

      <DestinationForm 
        categories={categories || []} 
        initialData={destination}
      />
    </div>
  );
}
