import { createClient } from "@/utils/supabase/server";
import { MapPin, Calendar, CheckCircle2, Archive, Plus, ArrowRight, LayoutDashboard, TrendingUp, Settings, Server, Clock } from "lucide-react";
import Link from "next/link";
import EventTable from "@/components/admin/EventTable";
import SystemInfoCard from "@/components/admin/cms/SystemInfoCard";
import { checkIsSuperAdmin } from "@/app/actions/admin";

export const metadata = {
  title: 'Dashboard | TIC Kota Bandung',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: totalDestinations } = await supabase
    .from('destinations')
    .select('*', { count: 'exact', head: true });
    
  const isSuperAdmin = await checkIsSuperAdmin();
  
  const { data: siteSettings } = await supabase.from('site_settings').select('*').limit(1).single();
  const systemInfo = {
    cms_version: siteSettings?.cms_version || 'v1.0.0',
    cms_status: siteSettings?.cms_status || 'Sistem berjalan normal',
    maintenance_date: siteSettings?.maintenance_date || 'Belum dijadwalkan',
    maintenance_time: siteSettings?.maintenance_time || '-',
    update_notes: siteSettings?.update_notes || ''
  };

  const { count: activeDestinations } = await supabase
    .from('destinations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: activeEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Fetch 5 latest events for the dashboard table
  const { data: latestEventsRaw } = await supabase
    .from('events')
    .select(`
      id, title, slug, start_date, end_date, images, status, created_at, organizer,
      destinations:destination_id (name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);
    
  const latestEvents = (latestEventsRaw || []).map((ev: any) => ({
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

  const draftDestinations = (totalDestinations || 0) - (activeDestinations || 0);
  const draftEvents = (totalEvents || 0) - (activeEvents || 0);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto py-4">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#3D7A5E]/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-[#3D7A5E]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#1b1c1a] tracking-tight">
                Dashboard Utama
              </h1>
            </div>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Ringkasan data destinasi wisata dan kalender kegiatan pariwisata Kota Bandung.
            </p>
          </div>
        </header>

        <SystemInfoCard info={systemInfo} isSuperAdmin={isSuperAdmin} />


        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Destinasi Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3D7A5E]/10 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D7A5E] to-[#2c5a45] shadow-lg shadow-[#3D7A5E]/20 flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Destinasi Wisata</h2>
                    <p className="text-sm text-gray-500">Total tempat terdaftar</p>
                  </div>
                </div>
                <span className="text-5xl font-display font-bold text-[#1b1c1a]">{totalDestinations || 0}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Aktif / Publik</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{activeDestinations || 0}</p>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <Archive className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Draft / Draf</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{draftDestinations}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 relative z-10">
              <Link 
                href="/admin/destinasi"
                className="inline-flex items-center text-sm font-semibold text-[#3D7A5E] hover:text-[#2c5a45] transition-colors group/link"
              >
                Lihat & Kelola Destinasi 
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Event Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9971E]/10 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9971E] to-[#a67c18] shadow-lg shadow-[#C9971E]/20 flex items-center justify-center text-white">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Kalender Event</h2>
                    <p className="text-sm text-gray-500">Total agenda pariwisata</p>
                  </div>
                </div>
                <span className="text-5xl font-display font-bold text-[#1b1c1a]">{totalEvents || 0}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Aktif / Publik</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{activeEvents || 0}</p>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <Archive className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Draft / Draf</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{draftEvents}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 relative z-10">
              <Link 
                href="/admin/event"
                className="inline-flex items-center text-sm font-semibold text-[#C9971E] hover:text-[#a67c18] transition-colors group/link"
              >
                Lihat & Kelola Agenda 
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Aksi Cepat</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/destinasi/baru" 
              className="group flex items-center gap-3 bg-[#3D7A5E] hover:bg-[#2c5a45] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#3D7A5E]/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="bg-white/20 p-1 rounded-md">
                <Plus className="w-4 h-4" />
              </div>
              Tambah Destinasi Baru
            </Link>
            
            <Link 
              href="/admin/event/baru" 
              className="group flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-100 text-gray-700 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5"
            >
              <div className="bg-gray-100 text-gray-500 p-1 rounded-md group-hover:bg-[#C9971E]/10 group-hover:text-[#C9971E] transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              Catat Agenda Event
            </Link>
          </div>
        </section>

        <section className="mt-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C9971E]" /> 
              Agenda Event Terbaru
            </h2>
            <Link href="/admin/event" className="text-sm font-semibold text-[#3D7A5E] hover:underline">
              Lihat Semua
            </Link>
          </div>
          <EventTable initialData={latestEvents} />
        </section>




      </div>
    </>
  );
}
