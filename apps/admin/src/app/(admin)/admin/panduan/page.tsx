import React from 'react';
import { BookOpen, ImageIcon, FileText, Camera, MapPin, Calendar, HelpCircle, AlertCircle, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { checkIsSuperAdmin } from '@/app/actions/admin';

export const metadata = {
  title: 'Panduan Penggunaan CMS | Admin TIC',
};

export default async function PanduanCMSPage() {
  const isSuperAdmin = await checkIsSuperAdmin();
  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 shadow-lg flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9971E]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3D7A5E]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#C9971E] font-bold text-sm tracking-widest uppercase mb-4">
            <BookOpen className="w-5 h-5" />
            <span>Dokumentasi Resmi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Buku Panduan CMS</h1>
          <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">
            Panduan lengkap cara mengelola konten website TIC Kota Bandung. Dirancang khusus untuk kemudahan staf admin (non-teknis).
          </p>
        </div>
      </div>

      {/* Intro Alert */}
      <div className="bg-white border-l-4 border-[#3D7A5E] rounded-r-2xl shadow-sm p-6 flex gap-4 items-start">
        <HelpCircle className="w-6 h-6 text-[#3D7A5E] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">Selamat Datang di CMS TIC Bandung</h3>
          <p className="text-slate-600 leading-relaxed">
            Gunakan panduan di bawah ini untuk memahami fungsi setiap menu di bilah kiri. Anda dapat mengubah, menambah, atau menyembunyikan (Draft) data tanpa perlu khawatir merusak struktur kode website.
          </p>
        </div>
      </div>

      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hero Slider */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <ImageIcon className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Hero Slider</h2>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm pb-4 border-b border-slate-100">
              Mengubah gambar besar bergeser yang pertama kali dilihat pengunjung di Halaman Utama (Home).
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span><strong>Cara Tambah:</strong> Klik "Tambah Slide Baru", unggah foto lanskap resolusi tinggi, isi judul & deskripsi.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span><strong>Urutan:</strong> Anda dapat mengatur nomor urutan tampil dari masing-masing slide.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span><strong>Menyembunyikan:</strong> Ubah status menjadi <em>Draft</em> jika tidak ingin dihapus permanen.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Berita */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
            <FileText className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Berita & Artikel</h2>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm pb-4 border-b border-slate-100">
              Mempublikasikan rilis pers, berita pariwisata, kegiatan pemerintahan, atau artikel informatif.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong>Identitas Penulis:</strong> Anda bisa menambahkan nama penulis (Author) dan perannya (misal: "Tim Redaksi") pada setiap berita.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong>Rich Text Editor:</strong> Tersedia pilihan "Normal" untuk membuat Heading (Judul/Sub-judul) yang proporsional tanpa perlu mengatur ukuran font manual.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong>Fitur Interaktif:</strong> Pengunjung publik sekarang dapat langsung membagikan atau menyalin tautan artikel Anda melalui tombol aksi di halaman berita.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Destinasi */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <MapPin className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Destinasi Wisata</h2>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm pb-4 border-b border-slate-100">
              Manajemen lokasi wisata, hotel, dan restoran yang ada di Kota Bandung.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-700">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span><strong>Syarat:</strong> Buat <strong>Kategori Destinasi</strong> terlebih dahulu sebelum menambahkan data Destinasi baru.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span><strong>Link Maps:</strong> Wajib diisi agar wisatawan bisa langsung mendapatkan petunjuk jalan (Google Maps).</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span><strong>Pilar Wisata:</strong> Kategori menentukan lokasi tampil (Stay, Explore, atau Eat).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Event & COE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="w-7 h-7 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Kalender Event (COE)</h2>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm pb-4 border-b border-slate-100">
              Agenda tahunan dan pendaftaran (submission) event dari penyelenggara luar.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span><strong>Pendaftaran Masuk:</strong> Proposal dari luar dapat di-<em>Review</em> dan di-<em>Approve</em>/<em>Reject</em>.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span><strong>Data Event Resmi:</strong> Jika pengajuan di-Approve, data dapat disalin ke sini agar tayang di website publik.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Galeri (Full Width) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-center">
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
          <Camera className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Galeri Visual Kota Bandung</h2>
          <p className="text-slate-600 text-sm mb-4">
            Menampilkan foto-foto estetik Kota Bandung di grid halaman utama. Sangat disarankan untuk mengunggah foto dengan orientasi beragam (lanskap dan potret) agar grid terlihat dinamis.
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
            <ChevronRight className="w-4 h-4" />
            <span>Klik "Tambah Foto" dan berikan Caption yang menarik.</span>
          </div>
        </div>
      </div>


      {/* Super Admin & Hak Akses (Full Width) */}
      {isSuperAdmin && (
        <div className="bg-slate-900 rounded-3xl shadow-sm border border-slate-800 p-8 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-center mt-6">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Fitur Khusus Super Admin</h2>
          <p className="text-slate-400 text-sm mb-4">
            Sistem dilengkapi dengan pembagian hak akses. Hanya pemegang akun <strong>Super Admin</strong> yang memiliki kendali atas sistem inti, meliputi:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-blue-300">
              <CheckCircle2 className="w-4 h-4" />
              <span><strong>Edit Informasi Sistem:</strong> Mengubah Versi CMS, Status Sistem, Jadwal Maintenance, dan Catatan Pembaruan (Update Notes) langsung dari halaman Dashboard Utama.</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-blue-300">
              <CheckCircle2 className="w-4 h-4" />
              <span><strong>Pembersihan Riwayat (Log):</strong> Kemampuan untuk menghapus seluruh riwayat aktivitas admin di menu Pengaturan - Log Aktivitas.</span>
            </li>
          </ul>
        </div>
      </div>

      )}
      {/* Tips / Best Practices */}
      <div className="bg-amber-50 rounded-3xl border border-amber-200 p-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-amber-900 text-xl">Best Practices</h3>
            <span className="text-amber-700 text-sm font-medium">Tips Penting</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-white/60 p-5 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">1. Optimasi Gambar</h4>
              <p className="text-amber-800 text-sm leading-relaxed">Kompres foto sebelum diunggah (idealnya di bawah 1MB) menggunakan tool gratis seperti TinyPNG agar website tidak menjadi lambat.</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">2. Gunakan Fitur Draft</h4>
              <p className="text-amber-800 text-sm leading-relaxed">Jangan sembarangan menghapus data secara permanen jika masih ada keraguan. Lebih aman mengubah statusnya menjadi <strong>Draft</strong> untuk menyembunyikannya dari publik.</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">3. Wajib Isi (*)</h4>
              <p className="text-amber-800 text-sm leading-relaxed">Pastikan semua form yang memiliki tanda bintang merah (wajib) diisi dengan benar. Sistem tidak akan menyimpan data jika kolom tersebut kosong.</p>
            </div>
            <div className="bg-white/60 p-5 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">4. Judul Padat & Jelas</h4>
              <p className="text-amber-800 text-sm leading-relaxed">Gunakan penamaan yang singkat namun representatif. Judul yang terlalu panjang akan terpotong secara otomatis di tampilan ponsel.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Padding */}
      <div className="h-12"></div>

    </div>
  );
}
