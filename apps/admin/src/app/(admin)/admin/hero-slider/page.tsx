import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon } from 'lucide-react';
import { AddHeroButton, EditHeroButton, DeleteHeroButton } from '@/components/admin/cms/HeroSliderClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Hero Slider | Admin TIC',
};

import Link from 'next/link';

export default async function HeroSliderAdminPage(
  props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page as string) || 1;
  const limit = 20;

  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: sliders, error, count } = await supabase
    .from('hero_sliders')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);
    
  const totalPages = count ? Math.ceil(count / limit) : 1;

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
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Menampilkan halaman <span className="font-medium">{page}</span> dari <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {page > 1 ? (
                      <Link
                        href={`/admin/hero-slider?page=${page - 1}`}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 bg-gray-50 cursor-not-allowed">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                      </span>
                    )}
                    
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                      {page}
                    </span>
                    
                    {page < totalPages ? (
                      <Link
                        href={`/admin/hero-slider?page=${page + 1}`}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 bg-gray-50 cursor-not-allowed">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                      </span>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
