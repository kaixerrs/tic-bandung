import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon } from 'lucide-react';
import { AddHeroButton, EditHeroButton, DeleteHeroButton } from '@/components/admin/cms/HeroSliderClient';

export const metadata = {
  title: 'Manajemen Hero Slider | Admin TIC',
};

export default async function HeroSliderAdminPage() {
  const supabase = await createClient();

  const { data: sliders, error } = await supabase
    .from('hero_sliders')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error("Error fetching hero sliders:", error);
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-[#C9971E]" />
              Manajemen Hero Slider
            </h1>
            <p className="text-gray-500 mt-2">Atur gambar dan teks yang muncul di bagian paling atas Halaman Home.</p>
          </div>
          
          <AddHeroButton />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Gambar</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Judul</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sliders && sliders.length > 0 ? (
                sliders.map((slider) => (
                  <tr key={slider.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="w-24 h-16 rounded-lg bg-gray-200 overflow-hidden relative shadow-sm">
                        <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{slider.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{slider.subtitle}</p>
                    </td>
                    <td className="p-4">
                      {slider.is_active ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Aktif</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Nonaktif</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <EditHeroButton slider={slider} />
                        <DeleteHeroButton id={slider.id} title={slider.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Belum ada data Hero Slider.
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
