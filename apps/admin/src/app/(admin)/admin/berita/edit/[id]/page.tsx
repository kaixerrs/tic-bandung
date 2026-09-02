
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BeritaForm from "@/components/admin/cms/BeritaForm";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata = {
  title: 'Edit Berita | TIC Kota Bandung',
};

export default async function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: article, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !article) {
    return <div className="p-8 text-red-500 font-mono whitespace-pre-wrap">Error loading article</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link 
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Data Berita
        </Link>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#3D7A5E]" />
          Edit Berita
        </h1>
        <p className="text-gray-500 mt-2">Perbarui informasi berita atau artikel.</p>
      </div>

      <BeritaForm initialData={article} />
    </div>
  );
}
