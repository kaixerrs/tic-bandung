import DashboardTable from "@/components/admin/DashboardTable";
import { createClient } from "@/utils/supabase/server";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Manajemen Destinasi | TIC Kota Bandung',
};

export default async function AdminDestinasiPage({ searchParams }: { searchParams: Promise<{ page?: string, category?: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || '1');
  const limit = 20;
  const currentCategory = resolvedParams?.category || 'Semua';

  // 1. Get all categories for tabs
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');
    
  let query = supabase
    .from('destinations')
    .select(`
      id,
      name,
      slug,
      status,
      images,
      created_at,
      category_id,
      categories!left (
        name,
        cluster_color
      )
    `, { count: 'exact' });

  if (currentCategory === 'Tanpa Kategori') {
    query = query.is('category_id', null);
  } else if (currentCategory !== 'Semua') {
    const matchedCat = (allCategories || []).find(c => c.name === currentCategory);
    if (matchedCat) {
      query = query.eq('category_id', matchedCat.id);
    }
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: destinations, count, error } = await query;

  if (error) {
    console.error("Destinasi Fetch Error:", error);
  }

  const formattedData = (destinations || []).map((dest: any) => ({
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    status: dest.status,
    category: dest.categories ? { 
      name: dest.categories.name, 
      cluster_color: dest.categories.cluster_color 
    } : null,
    image_url: dest.images && dest.images.length > 0 ? dest.images[0] : null,
    created_at: dest.created_at
  }));

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-[#C9971E]" />
              Daftar Destinasi
            </h1>
            <p className="text-gray-500 mt-2">Kelola seluruh data titik destinasi wisata Kota Bandung.</p>
          </div>
        </div>

        {/* Main Table */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Database Destinasi</h2>
          <Link 
            href="/admin/destinasi/baru" 
            className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Destinasi Baru
          </Link>
        </div>
        
        <DashboardTable 
          initialData={formattedData} 
          allCategories={allCategories || []} 
          currentPage={page}
          totalPages={totalPages}
          currentCategory={currentCategory}
        />

      </div>
    </>
  );
}
