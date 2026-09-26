import { getSiteSettings } from '@/app/actions/cmsActions';
import InformasiClient from '@/components/admin/cms/InformasiClient';
import { Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kebijakan Privasi | Admin TIC',
};

export default async function InformasiPage() {
  const settings = await getSiteSettings();
  const initialContent = settings?.page_privacy || '';

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Info className="w-8 h-8 text-[#C9971E]" />
              Kebijakan Privasi
            </h1>
            <p className="text-gray-500 mt-2">Kelola konten statis untuk halaman Kebijakan Privasi.</p>
          </div>
        </div>

        <InformasiClient title="Kebijakan Privasi" field="page_privacy" initialContent={initialContent} />
      </div>
    </>
  );
}
