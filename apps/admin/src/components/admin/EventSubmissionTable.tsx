"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { useState, useTransition } from 'react';
import { updateSubmissionStatusAction, deleteSubmissionAction } from '@/app/actions/eventSubmission';
import { ExternalLink, CheckCircle, XCircle, Clock, Eye, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import EventSubmissionDetailModal from './EventSubmissionDetailModal';

type SubmissionData = {
  id: string; title: string; start_date: string; end_date: string;
  pic_name: string; eo_name: string; email: string; whatsapp: string;
  location: string; description: string; instagram: string; kol_partner: string;
  artist_performance: string; usp: string; target_visitors: number;
  execution_count: number; promotion_media: string; attachment_link: string;
  commitment_letter_link: string; status: string; created_at: string;
  event_scale: string; event_category: string; country: string; province: string;
  city: string; district: string; village: string; latitude: number; longitude: number;
  timezone: string; has_registration: boolean; event_type: string;
  payment_type: string; additional_info_link: string; ticket_links: string[];
  thumbnail_link: string; gallery_links: string[]; sponsors: { name: string; logo_url: string }[];
};

export default function EventSubmissionTable({ initialData }: { initialData: SubmissionData[] }) {
  const [data, setData] = useState<SubmissionData[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin mengubah status menjadi ${status}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal'
    });
    if (!confirmResult.isConfirmed) return;
    
    startTransition(async () => {
      const result = await updateSubmissionStatusAction(id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: status } : item
        ));
      }
    });
  };

  
  
  const handleDelete = async (id: string) => {
    const confirmResult = await Swal.fire({
      title: 'Hapus Pengajuan?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (!confirmResult.isConfirmed) return;
    
    startTransition(async () => {
      const result = await deleteSubmissionAction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Berhasil menghapus pengajuan!");
        setData(prev => prev.filter(item => item.id !== id));
      }
    });
  };

  const showDetail = (item: SubmissionData) => {
    setSelectedSubmission(item);
    setIsModalOpen(true);
  };
  
  /* Removed old SweetAlert modal */
  
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      'Tanggal Masuk': new Date(item.created_at).toLocaleDateString('id-ID'),
      'Judul Acara': item.title,
      'Kategori': item.event_category,
      'Skala': item.event_scale,
      'Tanggal Mulai': item.start_date,
      'Tanggal Selesai': item.end_date,
      'Lokasi (Patokan)': item.location,
      'Tipe Acara': item.event_type || '-',
      'Tipe Pembayaran': item.payment_type || '-',
      'Ada Registrasi?': item.has_registration ? 'Ya' : 'Tidak',
      'Zona Waktu': item.timezone || '-',
      'Link Tiket': (item.ticket_links || []).join(', '),
      'Link Thumbnail': item.thumbnail_link || '-',
      'Jumlah Sponsor': (item.sponsors || []).length,
      'Kecamatan': item.district,
      'Kabupaten/Kota': item.city,
      'Provinsi': item.province,
      'Latitude': item.latitude,
      'Longitude': item.longitude,
      'EO / Komunitas': item.eo_name,
      'Nama PIC': item.pic_name,
      'Email': item.email,
      'WhatsApp': item.whatsapp,
      'Instagram': item.instagram,
      'KOL': item.kol_partner,
      'Artis': item.artist_performance,
      'Deskripsi': item.description,
      'USP': item.usp,
      'Target Pengunjung': item.target_visitors,
      'Pelaksanaan Ke': item.execution_count,
      'Link Media Promosi (GDrive)': item.promotion_media || '-',
      'Link Proposal/Poster': item.attachment_link || '-',
      'Link Surat Kesediaan': item.commitment_letter_link || '-',
      'Status': item.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendaftaran Event");
    XLSX.writeFile(wb, "Data_Pendaftaran_Event.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={exportToExcel}
          className="px-4 py-2 bg-[#217346] hover:bg-[#1e6b41] text-white font-bold rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4 pl-6">Tanggal Masuk</th>
              <th className="p-4">Acara</th>
              <th className="p-4">PIC & EO</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Belum ada pendaftaran event yang masuk.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{item.title || '-'}</p>
                    <p className="text-xs text-gray-500">{item.start_date ? new Date(item.start_date).toLocaleDateString('id-ID') : '-'}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-gray-700">{item.pic_name}</p>
                    <p className="text-xs text-gray-500">{item.eo_name}</p>
                  </td>
                  
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                      {item.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {item.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="p-4 pr-6 text-right">
                    
                    <div className="flex items-center justify-end gap-2">
                      {item.commitment_letter_link && (
                        <a 
                          href={item.commitment_letter_link}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200 flex items-center justify-center gap-1"
                          title="Download Surat Kesediaan"
                        >
                          <Download className="w-3 h-3" /> Surat
                        </a>
                      )}
                      <button 
                        onClick={() => showDetail(item)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Lihat Detail
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 flex items-center justify-center"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
      <EventSubmissionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedSubmission}
        onApprove={(id) => handleUpdateStatus(id, "APPROVED")}
        onReject={(id) => handleUpdateStatus(id, "REJECTED")}
      />
    </div>
  );
}
