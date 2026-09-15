import { useState } from 'react';
import { X, CheckCircle, XCircle, Calendar, MapPin, User, Clock, Link as LinkIcon, Download, Check, Building, FileText, Image as ImageIcon } from 'lucide-react';

type SubmissionData = {
  id: string; title: string; start_date: string; end_date: string;
  pic_name: string; eo_name: string; email: string; whatsapp: string;
  location: string; description: string; instagram: string; kol_partner: string;
  artist_performance: string; usp: string; target_visitors: number;
  execution_count: number; promotion_media: string; attachment_link: string;
  commitment_letter_link: string; status: string; created_at: string;
  event_scale: string; event_category: string; country: string; province: string;
  city: string; district: string; village: string; latitude: number; longitude: number;
  
  // New complex fields
  timezone: string;
  has_registration: boolean;
  event_type: string;
  payment_type: string;
  additional_info_link: string;
  ticket_links: string[];
  thumbnail_link: string;
  gallery_links: string[];
  sponsors: { name: string; logo_url: string }[];
};

interface EventSubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubmissionData | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function EventSubmissionDetailModal({ isOpen, onClose, data, onApprove, onReject }: EventSubmissionDetailModalProps) {
  if (!isOpen || !data) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Detail Pendaftaran Event</h2>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
              data.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              data.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {data.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
              {data.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
              {data.status === 'PENDING' && <Clock className="w-3 h-3" />}
              {data.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 space-y-6">
          
          {/* Section 1: Visuals */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-amber-500" /> Media & Galeri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <p className="text-xs font-semibold text-gray-500 mb-2">Thumbnail Utama</p>
                {data.thumbnail_link ? (
                  <div className="aspect-[3/2] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={data.thumbnail_link} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[3/2] rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">Tidak ada thumbnail</div>
                )}
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">Galeri Foto ({data.gallery_links?.length || 0})</p>
                {data.gallery_links && data.gallery_links.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {data.gallery_links.map((link, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img src={link} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[120px] rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">Tidak ada galeri</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Informasi Dasar */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-500" /> Informasi Acara
            </h3>
            
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gray-900">{data.title || '-'}</h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{data.description || 'Tidak ada deskripsi.'}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">Kategori</p>
                <p className="font-bold text-gray-900">{data.event_category || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">Skala</p>
                <p className="font-bold text-gray-900">{data.event_scale || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">Tipe Acara</p>
                <p className="font-bold text-gray-900">{data.event_type || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">Tipe Pembayaran</p>
                <p className="font-bold text-gray-900">{data.payment_type || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Waktu Pelaksanaan</p>
                    <p className="font-medium text-gray-900 text-sm mt-1">{formatDate(data.start_date)} - {formatDate(data.end_date)} {data.timezone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Lokasi</p>
                    <p className="font-medium text-gray-900 text-sm mt-1">{data.location || '-'}</p>
                    <p className="text-xs text-gray-500 mt-1">{[data.district, data.city, data.province].filter(Boolean).join(', ')}</p>
                    {data.latitude && data.longitude && (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block font-medium">Lihat di Google Maps &rarr;</a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Registrasi / Pembelian Tiket</p>
                  <p className="font-medium text-gray-900 text-sm">{data.has_registration ? 'Ya, ada registrasi' : 'Tidak ada registrasi (Langsung Datang)'}</p>
                  {data.has_registration && data.ticket_links && data.ticket_links.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {data.ticket_links.map((link, idx) => (
                        <a key={idx} href={link} target="_blank" rel="noreferrer" className="block text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> {link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Penyelenggara & Sponsor */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Building className="w-4 h-4 text-emerald-500" /> Penyelenggara & Sponsor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Penyelenggara (EO/Komunitas)</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {data.eo_name ? data.eo_name.substring(0, 2).toUpperCase() : 'EO'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{data.eo_name || '-'}</p>
                    <p className="text-xs text-gray-500">{data.instagram || '-'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Kontak Penanggung Jawab (PIC)</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{data.pic_name || '-'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <a href={`mailto:${data.email}`} className="hover:text-blue-600">{data.email || '-'}</a>
                      �
                      <a href={`https://wa.me/${data.whatsapp?.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="hover:text-green-600 font-medium text-green-700">{data.whatsapp || '-'}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {data.sponsors && data.sponsors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3 border-t border-gray-100 pt-4">Sponsor / Partner Terlibat</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {data.sponsors.map((sponsor, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 gap-2">
                      {sponsor.logo_url ? (
                        <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400"><ImageIcon className="w-4 h-4" /></div>
                      )}
                      <span className="text-xs font-bold text-gray-700 text-center">{sponsor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Data Tambahan & Dokumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Check className="w-4 h-4 text-purple-500" /> Detail Ekstra
              </h3>
              <div className="space-y-4">
                <div><span className="text-xs font-semibold text-gray-500 block">Line-up / Artis</span><span className="text-sm font-medium text-gray-900">{data.artist_performance || '-'}</span></div>
                <div><span className="text-xs font-semibold text-gray-500 block">KOL Partner</span><span className="text-sm font-medium text-gray-900">{data.kol_partner || '-'}</span></div>
                <div><span className="text-xs font-semibold text-gray-500 block">Nilai Jual Unik (USP)</span><span className="text-sm text-gray-700">{data.usp || '-'}</span></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-xs font-semibold text-gray-500 block">Target Pengunjung</span><span className="text-sm font-medium text-gray-900">{data.target_visitors ? `${data.target_visitors} orang` : '-'}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 block">Pelaksanaan Ke-</span><span className="text-sm font-medium text-gray-900">{data.execution_count || '-'}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Download className="w-4 h-4 text-rose-500" /> Berkas Lampiran
              </h3>
              <div className="space-y-3">
                <a href={data.promotion_media || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-md text-blue-600"><LinkIcon className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">Media Promosi (Drive)</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Buka &rarr;</span>
                </a>
                
                {data.attachment_link && (
                  <a href={data.attachment_link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-md text-purple-600"><FileText className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700">Proposal / Poster</span>
                    </div>
                    <span className="text-xs font-bold text-purple-600">Buka &rarr;</span>
                  </a>
                )}

                {data.commitment_letter_link && (
                  <a href={data.commitment_letter_link} target="_blank" rel="noreferrer" download className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-200 rounded-md text-emerald-700"><Download className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold text-emerald-800">Surat Kesediaan Laporan</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">Unduh Berkas</span>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between sticky bottom-0 z-10">
          <p className="text-xs text-gray-500">Dikirim pada: {formatDate(data.created_at)}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => { onClose(); onReject(data.id); }}
              disabled={data.status === 'REJECTED'}
              className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {data.status === 'APPROVED' ? 'Batalkan (Tolak Event)' : 'Tolak Event'}
            </button>
            <button 
              onClick={() => { onClose(); onApprove(data.id); }}
              disabled={data.status === 'APPROVED'}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> {data.status === 'REJECTED' ? 'Terima & Terbitkan Ulang' : 'Terima & Terbitkan'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
