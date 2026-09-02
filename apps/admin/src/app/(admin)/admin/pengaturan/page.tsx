import { createClient } from '@/utils/supabase/server';
import PengaturanClient from '@/components/admin/cms/PengaturanClient';
import { Settings } from 'lucide-react';
import { getSiteSettings } from '@/app/actions/cmsActions';

export const metadata = {
  title: 'Site Settings | Admin TIC',
};

export default async function PengaturanPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#C9971E]" />
              Site Settings & Footer
            </h1>
            <p className="text-gray-500 mt-2">Kelola informasi global, kontak darurat, dan tautan sosial media untuk situs publik.</p>
          </div>
        </div>

        <PengaturanClient initialData={settings} />
      </div>
    </>
  );
}
