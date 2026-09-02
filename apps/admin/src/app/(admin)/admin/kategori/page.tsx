import { createClient } from "@/utils/supabase/server";
import { FolderTree } from "lucide-react";
import CategoryListClient from "@/components/admin/CategoryListClient";

export const metadata = {
  title: "Manajemen Kategori | Admin TIC Kota Bandung",
};

export default async function AdminCategoryPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("cluster")
    .order("name");

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
      
      <CategoryListClient categories={categories || []} />
    </div>
  );
}
