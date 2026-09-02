import { createClient } from "@/utils/supabase/server";
import EventForm from "@/components/admin/EventForm";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Tambah Event Baru | TIC Kota Bandung',
};

export default async function NewEventPage() {
  const supabase = await createClient();

  // Fetch destinations for location selection
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name');

  return (
    <>
      <div className="max-w-full w-full mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/event"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kalender Event
          </Link>
          
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#C9971E]" />
            Tambah Event Baru
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Tambahkan kegiatan atau acara pariwisata baru ke dalam kalender Kota Bandung.
          </p>
        </div>

        <EventForm destinations={destinations || []} />
      </div>
    </>
  );
}
