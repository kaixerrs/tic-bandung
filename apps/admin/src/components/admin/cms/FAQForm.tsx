
"use client";
import { useState, useEffect } from 'react';
import { createFAQ, updateFAQ } from '@/app/actions/cmsActions';
import { X } from 'lucide-react';

export default function FAQForm({ faq, onClose, onSuccess }: { faq?: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = faq 
      ? await updateFAQ(faq.id, formData)
      : await createFAQ(formData);
      
    if (res.error) {
      setError(res.error);
    } else {
      onSuccess();
    }
    setLoading(false);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">{faq ? 'Edit FAQ' : 'Tambah FAQ'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {error && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          <form id="faqForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 border-r pr-4">
                <h3 className="font-bold text-sm text-[#3D7A5E]">Bahasa Indonesia</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pertanyaan (ID)</label>
                  <input required name="question" defaultValue={faq?.question} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Jawaban (ID)</label>
                  <textarea required name="answer" defaultValue={faq?.answer} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-600">English</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Question (EN)</label>
                  <input name="question_en" defaultValue={faq?.question_en} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Answer (EN)</label>
                  <textarea name="answer_en" defaultValue={faq?.answer_en} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Urutan Tampil (Opsional)</label>
                <input type="number" name="order_num" defaultValue={faq?.order_num || 0} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div className="flex-1 flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" defaultChecked={faq ? faq.is_active : true} className="w-4 h-4 text-[#3D7A5E] rounded focus:ring-[#3D7A5E]" />
                  <span className="text-sm font-medium text-slate-700">Aktif (Ditampilkan)</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Batal</button>
          <button form="faqForm" type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-[#3D7A5E] hover:bg-[#2c5c45] rounded-lg disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}
