import { createClient } from '@/utils/supabase/server';
import { FileText } from 'lucide-react';
import { AddBeritaButton, EditBeritaButton, DeleteBeritaButton } from '@/components/admin/cms/BeritaClient';

export const metadata = {
  title: 'Manajemen Berita & Artikel | Admin TIC',
};

export default async function BeritaAdminPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching news articles:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#C9971E]" />
              Manajemen Berita & Artikel
            </h1>
            <p className="text-gray-500 mt-2">Kelola konten berita, artikel, dan tips wisata yang tampil di halaman depan.</p>
          </div>
          
          <AddBeritaButton />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Gambar</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Informasi Artikel</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Tanggal Publish</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="w-24 h-16 rounded-lg bg-gray-200 overflow-hidden relative shadow-sm">
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 mb-1">{article.title}</p>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${article.color_theme === 'emerald' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${article.color_theme === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                        ${article.color_theme === 'amber' ? 'bg-amber-100 text-amber-700' : ''}
                        ${article.color_theme === 'rose' ? 'bg-rose-100 text-rose-700' : ''}
                        ${article.color_theme === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                        ${!['emerald', 'blue', 'amber', 'rose', 'purple'].includes(article.color_theme) ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(article.date_published)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <EditBeritaButton article={article} />
                        <DeleteBeritaButton id={article.id} title={article.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Belum ada data Berita.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
