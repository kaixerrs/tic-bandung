import { createClient } from "@/utils/supabase/server";
import { FolderTree } from "lucide-react";
import CategoryListClient from "@/components/admin/CategoryListClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Manajemen Kategori | Admin TIC Kota Bandung",
};

export default async function AdminCategoryPage(
  props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page as string) || 1;
  const limit = 20;
  
  const supabase = await createClient();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data: categories, count } = await supabase
    .from("categories")
    .select("*", { count: 'exact' })
    .order("cluster")
    .order("name")
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <FolderTree className="w-8 h-8 text-[#C9971E]" />
          Manajemen Kategori
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Kelola thumbnail visual untuk setiap kategori destinasi wisata.
        </p>
      </div>
      
      <CategoryListClient 
        categories={categories || []} 
        currentPage={page} 
        totalPages={totalPages} 
      />
    </div>
  );
}
