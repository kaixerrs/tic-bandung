
"use client";
import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import FAQForm from '@/components/admin/cms/FAQForm';
import { deleteFAQ } from '@/app/actions/cmsActions';

export default function FAQClientPage({ initialFaqs }: { initialFaqs: any[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  
  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus FAQ ini?')) {
      await deleteFAQ(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen FAQ</h1>
          <p className="text-slate-500 text-sm">Kelola daftar tanya jawab (FAQ) untuk ditampilkan di website.</p>
        </div>
        <button 
          onClick={() => { setEditingFaq(null); setFormOpen(true); }}
          className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Tambah FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="p-4 font-semibold">No</th>
              <th className="p-4 font-semibold">Pertanyaan (ID)</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faqs.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Belum ada FAQ.</td></tr>
            ) : faqs.map((faq: any, i: number) => (
              <tr key={faq.id} className="hover:bg-slate-50">
                <td className="p-4">{faq.order_num || i + 1}</td>
                <td className="p-4 max-w-md font-medium text-slate-900">{faq.question}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {faq.is_active ? 'Aktif' : 'Draft'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingFaq(faq); setFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {formOpen && (
        <FAQForm 
          faq={editingFaq} 
          onClose={() => setFormOpen(false)} 
          onSuccess={() => { setFormOpen(false); window.location.reload(); }} 
        />
      )}
    </div>
  );
}
