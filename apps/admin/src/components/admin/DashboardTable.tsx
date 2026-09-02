"use client";
import Swal from 'sweetalert2';

import { useState, useTransition, useEffect } from 'react';
import { togglePublishStatusAction } from '@/app/actions/dashboard';
import { deleteDestinationAction } from '@/app/actions/destination';
import { Trash2, Edit2, ExternalLink, Eye, EyeOff, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DestinationData {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: { name: string; cluster_color: string } | null;
  image_url: string | null;
  created_at: string;
}

export default function DashboardTable({ 
  initialData, 
  allCategories, 
  currentPage = 1, 
  totalPages = 1, 
  currentCategory = 'Semua' 
}: { 
  initialData: DestinationData[], 
  allCategories: {name: string}[],
  currentPage?: number,
  totalPages?: number,
  currentCategory?: string
}) {
  const [data, setData] = useState<DestinationData[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  // Sync state if props change (server pagination)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const categoryTabs = ['Semua', ...allCategories.map(c => c.name), 'Tanpa Kategori'];

  const handleTabChange = (tab: string) => {
    router.push(`/admin/destinasi?category=${encodeURIComponent(tab)}&page=1`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/admin/destinasi?category=${encodeURIComponent(currentCategory)}&page=${page}`);
  };

  const filteredData = data; // Filtering is now done on the server

  const handleDelete = async (id: string, name: string) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Peringatan! Apakah Anda yakin ingin menghapus destinasi "${name}"? Tindakan ini tidak bisa dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (!confirmResult.isConfirmed) return;

    // Optimistic UI update
    setData(prev => prev.filter(item => item.id !== id));
    
    startTransition(async () => {
      const result = await deleteDestinationAction(id);
      if (result.error) {
        setErrorMsg(`Gagal menghapus: ${result.error}`);
        // Revert data if failed (simple reload strategy for safety)
        window.location.reload();
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    // Optimistic UI update
    setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    startTransition(async () => {
      const result = await togglePublishStatusAction(id, currentStatus);
      if (result.error) {
        setErrorMsg(`Gagal mengubah status: ${result.error}`);
        window.location.reload();
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#d3c5af]/50 overflow-hidden">
      
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      {/* Category Tabs */}
      <div className="border-b border-[#f6f3f0] overflow-x-auto">
        <div className="flex p-2 gap-2 min-w-max">
          {categoryTabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentCategory === tab 
                ? 'bg-[#3D7A5E] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-[#f6f3f0] text-gray-700 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Destinasi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1b1c1a]">{item.name}</p>
                      <Link href={`/destinasi/${item.slug}`} target="_blank" className="text-xs text-[#3D7A5E] hover:underline flex items-center gap-1 mt-1">
                        Lihat Halaman <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.category ? (
                    <span 
                      className="px-2.5 py-1 text-xs font-bold rounded-md whitespace-nowrap"
                      style={{ 
                        backgroundColor: `${item.category.cluster_color}15`, 
                        color: item.category.cluster_color 
                      }}
                    >
                      {item.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Tanpa Kategori</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      item.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {item.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/destinasi/edit/${item.id}`}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit Destinasi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={isPending}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus Destinasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Tidak ada data destinasi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-600">
            Halaman <span className="font-bold text-gray-900">{currentPage}</span> dari <span className="font-bold text-gray-900">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
