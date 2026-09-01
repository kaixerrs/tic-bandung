import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Ticket, ChevronRight, Navigation, Download } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();
  
  const { data: destination } = await supabase
    .from('destinations')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!destination) return { title: 'Destinasi Tidak Ditemukan' };

  return {
    title: `${destination.name} | TIC Kota Bandung`,
    description: destination.description || `Informasi lengkap mengenai ${destination.name} di Kota Bandung.`,
  };
}

export const revalidate = 3600; // Cache for 1 hour

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();

  // Fetch Destination details, images, and category
  const { data: dest, error } = await supabase
    .from('destinations')
    .select(`
      *,
      categories (
        name,
        slug,
        cluster_color
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !dest) {
    notFound();
  }

  const category = dest.categories;
  const primaryImage = dest.images?.[0] || dest.destination_images?.[0]?.image_url;
  const photoCredit = dest.source_photo_credit || dest.destination_images?.[0]?.source_photo_credit;

  // Parse price_info
  let ticketType = 'UNCONFIRMED';
  let ticketNominal: number | null = null;
  if (dest.price_info) {
    try {
      const parsed = typeof dest.price_info === 'string' ? JSON.parse(dest.price_info) : dest.price_info;
      ticketType = parsed.type || 'UNCONFIRMED';
      ticketNominal = parsed.nominal || null;
    } catch { /* keep defaults */ }
  }

  // Parse opening_hours into readable format
  let openingHoursEntries: [string, string][] = [];
  if (dest.opening_hours) {
    try {
      const parsed = typeof dest.opening_hours === 'string' ? JSON.parse(dest.opening_hours) : dest.opening_hours;
      openingHoursEntries = Object.entries(parsed) as [string, string][];
    } catch { /* skip */ }
  }

  const getCategoryColor = (cluster: string) => {
    if (cluster === 'green') return '#3D7A5E';
    if (cluster === 'gold') return '#C9971E';
    if (cluster === 'blue') return '#2C5C8A';
    if (cluster === 'teal') return '#2C7A7A';
    return '#4f4635';
  };

  const themeColor = getCategoryColor(category?.cluster_color || '');

  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen">
      
      {/* Hero Image Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-gray-900">
        <Image
          src={primaryImage || 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=2000'}
          alt={dest.name}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col justify-end">
          <div className="max-w-[1600px] mx-auto w-full">
            {/* Breadcrumb */}
            <nav className="flex text-white/80 text-sm mb-4 items-center gap-2 font-medium">
              <Link className="hover:text-white transition-colors" href="/">Beranda</Link>
              <ChevronRight className="w-4 h-4" />
              <Link className="hover:text-white transition-colors" href="/kategori">Kategori</Link>
              <ChevronRight className="w-4 h-4" />
              {category && (
                <>
                  <Link className="hover:text-white transition-colors" href={`/kategori/${category.slug}`}>{category.name}</Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-white line-clamp-1">{dest.name}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-2 leading-tight">
              {dest.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5 text-[#C9971E]" />
              <span className="text-lg">{dest.district || 'Bandung'}</span>
            </div>
          </div>
        </div>

        {/* NFR-11 Photo Credit */}
        {photoCredit && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/70 text-[10px] px-2 py-1 rounded">
            Foto oleh: {photoCredit}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Description & Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-5 md:p-8 rounded-sm border border-[#d3c5af]/50 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1b1c1a] mb-4">Tentang {dest.name}</h2>
              <div className="prose prose-lg text-[#4f4635] leading-relaxed max-w-none">
                {dest.description ? (
                  dest.description.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p className="italic">Belum ada deskripsi untuk destinasi ini.</p>
                )}
              </div>
            </div>

            {/* Konten Detail dari CMS (Rich Text) */}
            {dest.content && (
              <div className="bg-white p-5 md:p-8 rounded-sm border border-[#d3c5af]/50 shadow-sm">
                <div 
                  className="prose prose-lg max-w-none text-[#4f4635] leading-relaxed prose-headings:text-[#1b1c1a] prose-a:text-[#3D7A5E] prose-strong:text-[#1b1c1a] prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: dest.content }}
                />
              </div>
            )}

            {/* Galeri Foto */}
            {dest.images && dest.images.length > 1 && (
              <div className="bg-white p-5 md:p-8 rounded-sm border border-[#d3c5af]/50 shadow-sm mt-8">
                <h3 className="text-2xl font-bold text-[#1b1c1a] mb-6">Galeri Foto</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dest.images.slice(1).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-[#f6f3f0]">
                      <Image fill sizes="(max-width: 768px) 100vw, 50vw" 
                        src={imgUrl} 
                        alt={`${dest.name} - Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm border border-[#d3c5af]/50 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-[#1b1c1a] mb-6 border-b border-[#f6f3f0] pb-4">Informasi Penting</h3>
              
              <div className="space-y-6">
                
                {/* Harga Tiket (NFR-09) */}
                {ticketType !== 'UNCONFIRMED' && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#3D7A5E]/10 flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5 text-[#3D7A5E]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#4f4635] uppercase tracking-wider mb-1">Harga Tiket</p>
                      <p className="font-semibold text-lg text-[#1b1c1a]">
                        {ticketType === 'FREE' ? (
                          <span className="text-[#3D7A5E]">Gratis</span>
                        ) : ticketNominal ? (
                          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(ticketNominal)
                        ) : (
                          'Berbayar'
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Jam Operasional */}
                {openingHoursEntries.length > 0 && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#4f4635] uppercase tracking-wider mb-2">Jam Buka</p>
                      <div className="space-y-1">
                        {openingHoursEntries.map(([day, time]) => (
                          <div key={day} className="flex gap-2 text-sm">
                            <span className="font-medium text-[#1b1c1a] w-16">{day}</span>
                            <span className="text-[#4f4635]">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                
                {/* Tahun Berdiri */}
                {dest.founded_year && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#4f4635] uppercase tracking-wider mb-1">Tahun Berdiri</p>
                      <p className="font-medium text-lg text-[#1b1c1a]">
                        {dest.founded_year}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Alamat Lanjutan */}
                {dest.address && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C9971E]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#C9971E]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#4f4635] uppercase tracking-wider mb-1">Alamat Lokasi</p>
                      <p className="font-medium text-sm text-[#1b1c1a] leading-relaxed mb-3">
                        {dest.address}
                      </p>
                      {dest.lat && dest.lng && (
                        <div className="flex gap-2">
                          <a 
                            href={`https://maps.google.com/?q=${dest.lat},${dest.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                          >
                            <Navigation className="w-3 h-3" />
                            Google Maps
                          </a>
                          <a 
                            href={`http://maps.apple.com/?q=${dest.lat},${dest.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                          >
                            <MapPin className="w-3 h-3" />
                            Apple Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Button: Google Maps & Leaflet */}
              <div className="mt-8 pt-6 border-t border-[#f6f3f0] space-y-3">
                {dest.leaflet_url && (
                  <a 
                    href={dest.leaflet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-white border-2 text-[#1b1c1a] font-bold flex items-center justify-center gap-2 transition-all hover:bg-gray-50 active:scale-[0.98]"
                    style={{ borderColor: themeColor }}
                  >
                    <Download className="w-5 h-5" style={{ color: themeColor }} />
                    Download Leaflet
                  </a>
                )}
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
