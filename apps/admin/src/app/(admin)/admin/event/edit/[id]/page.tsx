import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Edit Event | TIC Kota Bandung',
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Fetch destinations for location dropdown
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name');

  // 2. Fetch event data
  const { data: eventData, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !eventData) {
    return (
      <div className="p-8 text-red-500 font-mono whitespace-pre-wrap">
        Error: {JSON.stringify(error, null, 2)}
        <br/><br/>
        ID: {id}
      </div>
    );
  }

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
            Edit Event
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Perbarui informasi kegiatan pariwisata <span className="font-bold text-gray-900">{eventData.title}</span>.
          </p>
        </div>

        <EventForm 
          destinations={destinations || []} 
          initialData={eventData} 
        />
      </div>
    </>
  );
}
