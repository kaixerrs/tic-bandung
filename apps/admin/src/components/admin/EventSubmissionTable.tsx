"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { useState, useTransition } from 'react';
import { updateSubmissionStatusAction, deleteSubmissionAction } from '@/app/actions/eventSubmission';
import { ExternalLink, CheckCircle, XCircle, Clock, Eye, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

type SubmissionData = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  pic_name: string;
  eo_name: string;
  email: string;
  whatsapp: string;
  location: string;
  description: string;
  instagram: string;
  kol_partner: string;
  artist_performance: string;
  usp: string;
  target_visitors: number;
  execution_count: number;
  promotion_media: string;
  attachment_link: string;
  commitment_letter_link: string;
  status: string;
  created_at: string;
};

export default function EventSubmissionTable({ initialData }: { initialData: SubmissionData[] }) {
  const [data, setData] = useState<SubmissionData[]>(initialData);
  const [isPending, startTransition] = useTransition();

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
    Swal.fire({
      title: '<span style="font-size: 1.25rem; font-weight: 700; color: #111827;">Detail Pengajuan Event</span>',
      html: `
        <div style="text-align: left; font-size: 14px; max-height: 65vh; overflow-y: auto; padding: 5px; color: #374151; display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Section 1 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #0f172a; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px;">
              <span style="background: #e2e8f0; color: #475569; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px;">1</span>
              Informasi Acara
            </h4>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
              <div><span style="color: #64748b; font-size: 12px; display: block;">Judul</span><strong style="color: #0f172a;">${item.title || '-'}</strong></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div><span style="color: #64748b; font-size: 12px; display: block;">Tanggal Mulai</span><strong style="color: #0f172a;">${item.start_date ? new Date(item.start_date).toLocaleDateString('id-ID') : '-'}</strong></div>
                <div><span style="color: #64748b; font-size: 12px; display: block;">Tanggal Selesai</span><strong style="color: #0f172a;">${item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID') : '-'}</strong></div>
              </div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Lokasi</span><strong style="color: #0f172a;">${item.location || '-'}</strong></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Deskripsi</span><span style="color: #334155; line-height: 1.5; display: block; margin-top: 4px;">${item.description || '-'}</span></div>
            </div>
          </div>

          <!-- Section 2 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #0f172a; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px;">
              <span style="background: #e2e8f0; color: #475569; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px;">2</span>
              Pelaksana & PIC
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div><span style="color: #64748b; font-size: 12px; display: block;">EO/Komunitas</span><strong style="color: #0f172a;">${item.eo_name || '-'}</strong></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Nama PIC</span><strong style="color: #0f172a;">${item.pic_name || '-'}</strong></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Email</span>${item.email ? `<a href="mailto:${item.email}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${item.email}</a>` : `<strong style="color: #0f172a;">-</strong>`}</div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">WhatsApp</span>${item.whatsapp ? `<a href="https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}" target="_blank" style="color: #16a34a; font-weight: bold; text-decoration: underline;">${item.whatsapp}</a>` : `<strong style="color: #0f172a;">-</strong>`}</div>
            </div>
          </div>

          <!-- Section 3 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #0f172a; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px;">
              <span style="background: #e2e8f0; color: #475569; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px;">3</span>
              Detail Tambahan
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div><span style="color: #64748b; font-size: 12px; display: block;">Instagram</span><strong style="color: #0f172a;">${item.instagram || '-'}</strong></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">KOL</span><strong style="color: #0f172a;">${item.kol_partner || '-'}</strong></div>
              <div style="grid-column: span 2;"><span style="color: #64748b; font-size: 12px; display: block;">Line Up Artis</span><strong style="color: #0f172a;">${item.artist_performance || '-'}</strong></div>
              <div style="grid-column: span 2;"><span style="color: #64748b; font-size: 12px; display: block;">Nilai Jual Unik (USP)</span><span style="color: #334155; line-height: 1.5; display: block; margin-top: 4px;">${item.usp || '-'}</span></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Target Pengunjung</span><strong style="color: #0f172a;">${item.target_visitors || '-'}</strong></div>
              <div><span style="color: #64748b; font-size: 12px; display: block;">Pelaksanaan Ke-</span><strong style="color: #0f172a;">${item.execution_count || '-'}</strong></div>
            </div>
          </div>

          <!-- Section 4 -->
          <div style="background: #f0fdf4; border: 1px dashed #4ade80; border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #166534; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px;">
              <span style="background: #dcfce7; color: #166534; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px;">4</span>
              Berkas Lampiran
            </h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <a href="${item.promotion_media || '#'}" target="_blank" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: white; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; text-decoration: none; font-weight: 600; font-size: 13px;">
                <span>Media Promosi (Drive)</span>
                <span>Buka &rarr;</span>
              </a>
              ${item.attachment_link ? `
              <a href="${item.attachment_link}" target="_blank" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: white; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; text-decoration: none; font-weight: 600; font-size: 13px;">
                <span>Proposal/Poster</span>
                <span>Buka &rarr;</span>
              </a>` : ''}
              ${item.commitment_letter_link ? `
              <a href="${item.commitment_letter_link}" target="_blank" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: white; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; text-decoration: none; font-weight: 600; font-size: 13px;">
                <span>Surat Kesediaan</span>
                <span>Unduh &darr;</span>
              </a>` : ''}
            </div>
          </div>

        </div>
      `,
      width: 650,
      showCloseButton: true,
      showConfirmButton: item.status === 'PENDING',
      showDenyButton: item.status === 'PENDING',
      confirmButtonText: 'Terima (Approve)',
      confirmButtonColor: '#10b981',
      denyButtonText: 'Tolak (Reject)',
      cancelButtonText: 'Tutup'
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(item.id, "APPROVED");
      } else if (result.isDenied) {
        handleUpdateStatus(item.id, "REJECTED");
      }
    });
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      'Tanggal Masuk': new Date(item.created_at).toLocaleDateString('id-ID'),
      'Judul Acara': item.title,
      'Tanggal Mulai': item.start_date,
      'Tanggal Selesai': item.end_date,
      'Lokasi': item.location,
      'EO / Komunitas': item.eo_name,
      'Nama PIC': item.pic_name,
      'Email': item.email,
      'WhatsApp': item.whatsapp,
      'Instagram': item.instagram,
      'KOL': item.kol_partner,
      'Artis': item.artist_performance,
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
    </div>
  );
}
