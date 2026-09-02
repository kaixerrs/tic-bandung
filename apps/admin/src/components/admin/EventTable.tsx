"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { useState, useTransition } from 'react';
import { deleteEventAction, toggleEventStatusAction } from '@/app/actions/event';
import { Trash2, Edit2, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type EventData = {
  id: string;
  title: string;
  slug: string;
  start_date: string;
  end_date: string;
  images: string[];
  status: string;
  created_at: string;
  destinations?: { name: string } | null;
  organizer?: string;
};

export default function EventTable({ initialData }: { initialData: EventData[] }) {
  const [data, setData] = useState<EventData[]>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string, title: string) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Peringatan! Apakah Anda yakin ingin menghapus event "${title}"? Tindakan ini tidak bisa dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (!confirmResult.isConfirmed) return;startTransition(async () => {
      const result = await deleteEventAction(id, title);
      if (result.error) {
        toast.error(result.error);
      } else {
        setData(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    startTransition(async () => {
      const result = await toggleEventStatusAction(id, currentStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: result.newStatus as string } : item
        ));
      }
    });
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start) return "-";
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (!end) return startStr;
    const endDate = new Date(end);
    
    // If same day
    if (startDate.toDateString() === endDate.toDateString()) {
      return startStr;
    }
    
    // If same month and year
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`;
    }
    
    return `${startStr} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4 pl-6">Event</th>
              <th className="p-4">Jadwal</th>
              <th className="p-4">Lokasi & Organizer</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Belum ada kalender event yang ditambahkan.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-[10px] bg-gray-50">
                            <Calendar className="w-4 h-4 mb-1" />
                            Poster
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm font-medium text-[#C9971E]">
                      {formatDateRange(item.start_date, item.end_date)}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {item.destinations ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#3D7A5E]" />
                          {item.destinations.name}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Lokasi Eksternal</span>
                      )}
                      
                      {item.organizer && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                          {item.organizer}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border transition-all ${
                        item.status === 'published' 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                      title="Klik untuk mengubah status"
                    >
                      {item.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {item.status}
                    </button>
                  </td>
                  
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/event/edit/${item.id}`}
                        className="p-2 text-gray-400 hover:text-[#C9971E] hover:bg-[#C9971E]/10 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      
                      <button 
                        onClick={() => handleDelete(item.id, item.title)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
