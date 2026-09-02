"use client";

import { useState, useTransition } from 'react';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { updateSiteSettings } from '@/app/actions/cmsActions';

export default function PengaturanClient({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result?.error) {
        setStatus({ type: 'error', message: result.error });
      } else {
        setStatus({ type: 'success', message: 'Pengaturan berhasil disimpan dan diperbarui di website!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 w-full">
      {status.type && (
        <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Footer Text */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Informasi Utama Footer</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat (Di bawah logo)</label>
              <textarea 
                name="description" 
                rows={3}
                defaultValue={initialData?.description || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors resize-none"
                placeholder="Jelajahi keindahan..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Kantor (Gunakan Enter untuk baris baru)</label>
              <textarea 
                name="address" 
                rows={3}
                defaultValue={initialData?.address || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors resize-none"
                placeholder="Jl. Asia Afrika No. 1..."
              />
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Kontak & WhatsApp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp TIC</label>
              <input 
                type="text" 
                name="whatsapp_number" 
                defaultValue={initialData?.whatsapp_number || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Format: 628111111111 (Tanpa + atau 0 di depan)"
              />
              <p className="text-xs text-gray-500 mt-2">Nomor ini akan digunakan untuk fitur "Chat TIC Bandung" yang melayang.</p>
            </div>
          </div>
        </section>

        {/* Emergencies */}
        <section>
          <h3 className="text-lg font-bold text-red-700 border-b border-gray-100 pb-3 mb-4">Nomor Darurat Kota</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Polisi</label>
              <input 
                type="text" 
                name="emergency_police" 
                defaultValue={initialData?.emergency_police || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ambulans</label>
              <input 
                type="text" 
                name="emergency_ambulance" 
                defaultValue={initialData?.emergency_ambulance || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pemadam Kebakaran</label>
              <input 
                type="text" 
                name="emergency_fire" 
                defaultValue={initialData?.emergency_fire || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors font-mono"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Sosial Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link Facebook</label>
              <input 
                type="text" 
                name="facebook_url" 
                defaultValue={initialData?.facebook_url || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link Instagram</label>
              <input 
                type="text" 
                name="instagram_url" 
                defaultValue={initialData?.instagram_url || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link YouTube</label>
              <input 
                type="text" 
                name="youtube_url" 
                defaultValue={initialData?.youtube_url || ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:hover:shadow-lg w-full md:w-auto justify-center"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
