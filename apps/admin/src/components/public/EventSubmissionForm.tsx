"use client";

import { useState } from 'react';
import { CheckCircle2, Calendar, MapPin, User, Phone, Mail, AtSign, Star, FileText, Send, Building, Target, UploadCloud, Download } from 'lucide-react';
import { submitEventFormAction } from '@/app/actions/eventSubmission';

export default function EventSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (target.value) {
      target.setAttribute('data-filled', 'true');
    } else {
      target.removeAttribute('data-filled');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Validasi Ukuran File (Max 2MB)
    const file = formData.get('commitment_letter_file') as File;
    if (file && file.size > 2 * 1024 * 1024) {
      setErrorMsg("Gagal: Ukuran file Surat Kesediaan maksimal 2 MB.");
      setIsSubmitting(false);
      return;
    }

    const result = await submitEventFormAction(formData);

    setIsSubmitting(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-sm p-10 border border-slate-700 shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Pendaftaran Berhasil!</h3>
        <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
          Terima kasih telah mendaftarkan event Anda di kalender TIC Kota Bandung. Tim kurator kami akan mereviu data secara komprehensif dan menghubungi Anda melalui WhatsApp atau Email.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95"
        >
          Kirim Form Lainnya
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onChange={handleChange} className="space-y-10 relative">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* SECTION 1: Informasi Dasar Event */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <Calendar className="w-5 h-5 text-amber-500" />
          1. Informasi Dasar Acara
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">1. Nama Acara <span className="text-red-500">*</span></label>
            <input type="text" name="title" required placeholder="Contoh: Asia Africa Festival 2026" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">2a. Tanggal Mulai <span className="text-red-500">*</span></label>
            <input type="date" name="start_date" required style={{ colorScheme: 'dark' }} className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">2b. Tanggal Selesai <span className="text-red-500">*</span></label>
            <input type="date" name="end_date" required style={{ colorScheme: 'dark' }} className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">3. Nama Pelaksana Acara (EO/Komunitas) <span className="text-red-500">*</span></label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" name="eo_name" required placeholder="Nama organisasi/komunitas pelaksana" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">4. Tempat Acara <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" name="location" required placeholder="Contoh: Kiara Artha Park, Bandung" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">5. Deskripsi Acara <span className="text-red-500">*</span></label>
            <textarea name="description" required rows={4} placeholder="Jelaskan secara singkat namun padat mengenai acara Anda..." className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors resize-none"></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 2: PIC & Kontak */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <User className="w-5 h-5 text-amber-500" />
          2. Informasi Penanggung Jawab
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">6. Nama Penanggung Jawab Acara <span className="text-red-500">*</span></label>
            <input type="text" name="pic_name" required placeholder="Nama lengkap PIC" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">7. Nomor WhatsApp PIC <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="tel" name="whatsapp" required placeholder="08xxxxxxxxxx" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email PIC <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="email" name="email" required placeholder="email@contoh.com" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Detail Spesifik & Promosi */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <Star className="w-5 h-5 text-amber-500" />
          3. Detail Tambahan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">8. Akun Instagram Acara <span className="text-red-500">*</span></label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" name="instagram" required placeholder="@namainstagram" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">9. Mitra KOL (Key Opinion Leader)</label>
            <input type="text" name="kol_partner" placeholder="Sebutkan jika ada" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">10. Pertunjukan Artis (Line Up)</label>
            <input type="text" name="artist_performance" placeholder="Siapa saja artis/pengisi acara yang akan hadir?" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">11. Nilai Jual Unik (Unique Selling Point) <span className="text-red-500">*</span></label>
            <textarea name="usp" required rows={3} placeholder="Apa yang membedakan acara ini dari yang lain?" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors resize-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">12. Target Jumlah Pengunjung <span className="text-red-500">*</span></label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="number" name="target_visitors" required placeholder="Contoh: 5000" className="w-full pl-12 pr-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">13. Pelaksanaan Ke-berapa Tahun Ini? <span className="text-red-500">*</span></label>
            <input type="number" name="execution_count" required placeholder="Contoh: 3" className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* SECTION 4: Lampiran */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <FileText className="w-5 h-5 text-amber-500" />
          4. Berkas Lampiran
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">15. Media Promosi (Google Drive Link) <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-3">Mohon berikan tautan Google Drive berisi Flyer, foto, video, dan logo acara.</p>
            <input type="url" name="promotion_media" required placeholder="https://drive.google.com/..." className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
          </div>

          <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700 border-dashed hover:border-amber-500/50 transition-colors">
            <label className="block text-sm font-medium text-slate-300 mb-2">14. Proposal, Poster, atau Berkas Penunjang <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-4">Mohon cantumkan link Google Drive/Dropbox.</p>
            <div className="relative">
              <input type="url" name="attachment_link" required placeholder="https://..." className="w-full px-4 py-3 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>

          <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700 border-dashed hover:border-amber-500/50 transition-colors">
            <label className="block text-sm font-medium text-slate-300 mb-2">16. Surat Kesediaan Laporan Pasca Event <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-4">Mohon unggah file surat kesediaan (PDF/DOCX).</p>
            <div className="relative">
              <input type="file" name="commitment_letter_file" accept=".pdf,.doc,.docx" required className="w-full px-4 py-2.5 bg-slate-900/50 data-[filled]:bg-slate-100 data-[filled]:text-slate-900 border border-slate-700 data-[filled]:border-amber-500 rounded-xl text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-slate-900 hover:file:bg-amber-600 cursor-pointer" />
            </div>
            <a href="/ASET%20VISUAL/surat/FORMAT%20SURAT%20PERNYATAAN%20KESANGGUPAN%20COE.docx" download className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-sm text-xs text-slate-900 font-bold transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Unduh Template Surat Laporan
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-700 flex justify-center md:justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
              Memproses Pengajuan...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Kirim Pengajuan Event
            </>
          )}
        </button>
      </div>
    </form>
  );
}
