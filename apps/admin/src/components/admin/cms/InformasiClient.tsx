"use client";

import { useState, useTransition } from 'react';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { updateStaticPage } from '@/app/actions/cmsActions';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Memuat Editor...</div> });

interface InformasiClientProps {
  title: string;
  field: 'page_about' | 'page_privacy' | 'page_terms';
  initialContent: string;
}

export default function InformasiClient({ title, field, initialContent }: InformasiClientProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [content, setContent] = useState(initialContent || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    
    startTransition(async () => {
      const result = await updateStaticPage(field, content);
      if (result?.error) {
        setStatus({ type: 'error', message: result.error });
      } else {
        setStatus({ type: 'success', message: 'Konten berhasil disimpan dan diperbarui di website!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <div className="p-8 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Edit {title}</h2>
        <p className="text-sm text-gray-500">Perubahan yang Anda simpan di sini akan langsung tampil di halaman publik website.</p>
      </div>

      <div className="p-8 pt-4">
        {status.type && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              className="h-[500px]" 
              modules={{ toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]}} 
            />
          </div>

          <div className="pt-8 flex justify-end">
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
              {isPending ? 'Menyimpan...' : 'Simpan Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
