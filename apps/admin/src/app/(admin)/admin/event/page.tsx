import EventTable from "@/components/admin/EventTable";
import { createClient } from "@/utils/supabase/server";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Manajemen Kalender Event | TIC Kota Bandung',
};

export default async function AdminEventPage() {
  const supabase = await createClient();

  // Fetch all events
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      id, title, slug, start_date, end_date, images, status, created_at, organizer,
      destinations:destination_id (name)
    `)
    .order('start_date', { ascending: false });

  if (error) {
    console.error("Event Fetch Error:", error);
  }

  const data = (events || []).map((ev: any) => ({
    id: ev.id,
    title: ev.title,
    slug: ev.slug,
    start_date: ev.start_date,
    end_date: ev.end_date,
    images: ev.images,
    status: ev.status,
    created_at: ev.created_at,
    organizer: ev.organizer,
    destinations: ev.destinations ? (Array.isArray(ev.destinations) ? ev.destinations[0] : ev.destinations) : null
  }));
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-[#C9971E]" />
              Kalender Event
            </h1>
            <p className="text-gray-500 mt-2">Kelola data kegiatan dan kalender event pariwisata Kota Bandung.</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Daftar Event</h2>
          <Link 
            href="/admin/event/baru" 
            className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Event Baru
          </Link>
        </div>
        
        <EventTable initialData={data} />
      </div>
    </>
  );
}
