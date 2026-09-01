"use client";

import { useState, useTransition } from "react";
import { Server, CheckCircle2, Clock, Edit2, X, Loader2, Info } from "lucide-react";
import { updateSystemInfo } from "@/app/actions/cmsActions";
import { toast } from "react-hot-toast";

type SystemInfo = {
  cms_version: string;
  cms_status: string;
  maintenance_date: string;
  maintenance_time: string;
  update_notes: string;
};

export default function SystemInfoCard({ 
  info, 
  isSuperAdmin 
}: { 
  info: SystemInfo; 
  isSuperAdmin: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateSystemInfo(formData);
      if (result.error) {
        toast.error("Gagal menyimpan: " + result.error);
      } else {
        toast.success("Informasi sistem berhasil diperbarui!");
        setIsModalOpen(false);
      }
    });
  };

  return (
    <>
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-100 to-transparent rounded-bl-full opacity-50 transition-transform duration-500" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Server className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Informasi Sistem</h2>
          </div>
          
          {isSuperAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Info
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Versi CMS</span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {info.cms_version} 
              <span className="bg-[#3D7A5E] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Terbaru</span>
            </span>
            <span className="text-sm text-[#3D7A5E] font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {info.cms_status}
            </span>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Maintenance Server</span>
            <span className="text-lg font-bold text-slate-900">{info.maintenance_date}</span>
            <span className="text-sm text-slate-600 mt-2 flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" /> {info.maintenance_time}
            </span>
          </div>
        </div>
        
        {info.update_notes && (
          <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3 relative z-10">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-bold text-blue-900 block mb-1">Catatan Pembaruan (Release Notes)</span>
              <p className="text-sm text-blue-800/80 leading-relaxed whitespace-pre-wrap">{info.update_notes}</p>
            </div>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Informasi Sistem
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto sidebar-scrollbar">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Versi CMS</label>
                <input 
                  name="cms_version" 
                  type="text" 
                  defaultValue={info.cms_version}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Sistem</label>
                <input 
                  name="cms_status" 
                  type="text" 
                  defaultValue={info.cms_status}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Maintenance</label>
                <input 
                  name="maintenance_date" 
                  type="text" 
                  defaultValue={info.maintenance_date}
                  placeholder="Misal: Minggu, 6 September 2026"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Waktu & Keterangan Maintenance</label>
                <input 
                  name="maintenance_time" 
                  type="text" 
                  defaultValue={info.maintenance_time}
                  placeholder="Misal: Pukul 01:00 - 03:00 WIB (Pencadangan)"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Pembaruan (Update Notes)</label>
                <textarea 
                  name="update_notes" 
                  rows={4}
                  defaultValue={info.update_notes}
                  placeholder="Jelaskan fitur apa saja yang baru diperbarui..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
