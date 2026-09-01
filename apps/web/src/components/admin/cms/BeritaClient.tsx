"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import Link from 'next/link';
import { useState, useTransition, useRef, useCallback, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, Eye, EyeOff } from 'lucide-react';
import { createNewsArticle, updateNewsArticle, deleteNewsArticle, toggleNewsStatus } from '@/app/actions/cmsActions';
import { compressImageToWebp, uploadToSupabase } from '@/utils/imageUpload';
import { CustomSelect } from '@/components/ui/CustomSelect';
import ImageCropperModal from '@/components/ui/ImageCropperModal';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type NewsArticle = {
  id: string;
  title: string;
  category: string;
  date_published: string;
  image_url: string;
  color_theme: string;
  link: string | null;
  is_featured: boolean;
  status?: string;
  content?: string;
  slug?: string;
  images?: string[];
};

export function AddBeritaButton() {
  return (
    <Link 
      href="/admin/berita/baru"
      className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
    >
      <Plus className="w-5 h-5" />
      Tambah Berita
    </Link>
  );
}

export function EditBeritaButton({ article }: { article: NewsArticle }) {
  return (
    <Link 
      href={`/admin/berita/edit/${article.id}`}
      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
      title="Edit Berita"
    >
      <Edit className="w-4 h-4" />
    </Link>
  );
}

export function DeleteBeritaButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus berita "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (confirmResult.isConfirmed) {
      startTransition(async () => {
        const result = await deleteNewsArticle(id);
        if (result?.error) {
          toast.error(`Error: ${result.error}`);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Berita"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
