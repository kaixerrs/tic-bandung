import { getSiteSettings } from '@/app/actions/cmsActions';
import InformasiClient from '@/components/admin/cms/InformasiClient';
import { Info } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami | Admin TIC',
};

export default async function InformasiPage() {
  const settings = await getSiteSettings();
  const initialContent = settings?.page_about || '';

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Info className="w-8 h-8 text-[#C9971E]" />
              Tentang Kami
            </h1>
            <p className="text-gray-500 mt-2">Kelola konten statis untuk halaman Tentang Kami.</p>
          </div>
        </div>

        <InformasiClient title="Tentang Kami" field="page_about" initialContent={initialContent} />
      </div>
    </>
  );
}
