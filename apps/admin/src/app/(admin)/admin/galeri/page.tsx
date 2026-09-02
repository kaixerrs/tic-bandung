import { createClient } from '@/utils/supabase/server';
import { Camera } from 'lucide-react';
import { AddGaleriButton, EditGaleriButton, DeleteGaleriButton } from '@/components/admin/cms/GaleriClient';

export const metadata = {
  title: 'Manajemen Galeri Visual | Admin TIC',
};

export default async function GaleriAdminPage() {
  const supabase = await createClient();

  const { data: galleries, error } = await supabase
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching galleries:", error);
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Camera className="w-8 h-8 text-[#C9971E]" />
              Manajemen Galeri Visual
            </h1>
            <p className="text-gray-500 mt-2">Kelola foto-foto yang akan ditampilkan di grid Galeri halaman depan.</p>
          </div>
          
          <AddGaleriButton />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Preview Gambar</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Informasi Foto</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Tipe Grid</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {galleries && galleries.length > 0 ? (
                galleries.map((gallery) => (
                  <tr key={gallery.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="w-24 h-24 rounded-xl bg-gray-200 overflow-hidden relative shadow-sm">
                        <img src={gallery.image_url} alt={gallery.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 mb-1">{gallery.title}</p>
                      {gallery.category && (
                        <p className="text-sm text-gray-500">Kategori: {gallery.category}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {gallery.is_featured ? (
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Foto Utama (Besar)</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Foto Kecil (Grid)</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <EditGaleriButton gallery={gallery} />
                        <DeleteGaleriButton id={gallery.id} title={gallery.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Belum ada data Galeri Visual.
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
