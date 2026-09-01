"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { useState, useTransition, useRef } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud } from 'lucide-react';
import { createHeroSlider, updateHeroSlider, deleteHeroSlider } from '@/app/actions/cmsActions';
import { compressImageToWebp, uploadToSupabase } from '@/utils/imageUpload';

type HeroSlider = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_link: string | null;
  is_active: boolean;
};

// Form Modal Component
function HeroSliderFormModal({
  isOpen,
  onClose,
  initialData = null
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: HeroSlider | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        let finalImageUrl = initialData?.image_url || '';
        
        // Handle image upload if a new file is selected
        if (selectedFile) {
                  const webpFile = await compressImageToWebp(selectedFile);
                  finalImageUrl = await uploadToSupabase(webpFile, 'hero');
        } else if (!initialData) {
          throw new Error('Gambar wajib diunggah untuk Hero Slider baru');
        }

        formData.set('image_url', finalImageUrl);

        let result;
        if (initialData) {
          result = await updateHeroSlider(initialData.id, formData);
        } else {
          result = await createHeroSlider(formData);
        }

        if (result?.error) {
          setError(result.error);
        } else {
          onClose();
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat menyimpan data');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      {/* Side Drawer */}
      <div className="bg-white shadow-2xl w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold font-display text-gray-900">
            {initialData ? 'Edit Hero Slider' : 'Tambah Hero Slider'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sidebar-scrollbar">
          <form id="hero-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Background (Wajib)</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-48 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-colors hover:bg-gray-50 ${previewImage ? 'border-gray-200' : 'border-[#3D7A5E]/30 bg-green-50/30'}`}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Ganti Gambar
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud className="w-8 h-8 text-[#3D7A5E] mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Klik untuk unggah gambar</p>
                    <p className="text-xs text-gray-500 mt-1">Otomatis dikompresi ke WebP</p>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama</label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={initialData?.title || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Contoh: Gedung Sate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul (Deskripsi Singkat)</label>
              <textarea 
                name="subtitle" 
                rows={3}
                defaultValue={initialData?.subtitle || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors resize-none"
                placeholder="Contoh: Ikon bersejarah perpaduan arsitektur..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Tombol (Opsional)</label>
              <input 
                name="button_link" 
                type="text" 
                defaultValue={initialData?.button_link || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="/destinasi/gedung-sate"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                name="is_active" 
                id="is_active" 
                defaultChecked={initialData ? initialData.is_active : true}
                className="w-5 h-5 accent-[#3D7A5E] rounded-md mt-0.5" 
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                Aktif (Tampilkan slider ini di halaman utama)
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-white shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="hero-form"
            disabled={isPending}
            className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Simpan Perubahan' : 'Tambah Slider'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddHeroButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Tambah Slider
      </button>
      <HeroSliderFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export function EditHeroButton({ slider }: { slider: HeroSlider }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        title="Edit Slider"
      >
        <Edit className="w-4 h-4" />
      </button>
      <HeroSliderFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialData={slider} />
    </>
  );
}

export function DeleteHeroButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus slider "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (confirmResult.isConfirmed) {
      startTransition(async () => {
        const result = await deleteHeroSlider(id);
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
      title="Hapus Slider"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
