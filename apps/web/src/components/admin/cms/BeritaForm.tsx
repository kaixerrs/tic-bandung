"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useState, useTransition, useRef, useCallback, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud } from 'lucide-react';
import { createNewsArticle, updateNewsArticle } from '@/app/actions/cmsActions';
import { compressImageToWebp, uploadToSupabase } from '@/utils/imageUpload';
import { CustomSelect } from '@/components/ui/CustomSelect';
import ImageCropperModal from '@/components/ui/ImageCropperModal';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
const ReactQuillAny = ReactQuill as any;

// Form Modal Component
export default function BeritaForm({
  initialData = null
}: {
  initialData?: any | null;
}) {
  const router = require("next/navigation").useRouter();
  const onClose = () => router.push("/admin/berita");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mainOriginalFile, setMainOriginalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<any>(null);
  const [contentHtml, setContentHtml] = useState<string>(initialData?.content || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryOriginalFiles, setGalleryOriginalFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>(initialData?.images || []);
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [cropTargetType, setCropTargetType] = useState<'main' | 'gallery' | string>('main');
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(16/9);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);

  // Modal for inline image source
  const [inlineImageModalOpen, setInlineImageModalOpen] = useState(false);
  const [inlineImageFile, setInlineImageFile] = useState<File | null>(null);
  const [inlineImageSource, setInlineImageSource] = useState("");
  const [inlineImageUploading, setInlineImageUploading] = useState(false);

  // Register quill resize module safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const Quill = require('react-quill-new').Quill;
        const ImageResize = require('quill-image-resize-module-react').default;
        Quill.register('modules/imageResize', ImageResize);
      } catch (e) {
        console.warn("Could not register ImageResize", e);
      }
    }
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        setInlineImageFile(file);
        setInlineImageSource("");
        setInlineImageModalOpen(true);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    imageResize: {
      parchment: typeof window !== 'undefined' ? require('react-quill-new').Quill.import('parchment') : null,
      modules: ['Resize', 'DisplaySize']
    }
  }), [imageHandler]);

  

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainOriginalFile(file);
      setCropTargetFile(file);
      setCropTargetType('main');
      setCropAspectRatio(16/9);
      setCropModalOpen(true);
      e.target.value = ''; // reset
    }
  };
  
  const handleEditMainImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mainOriginalFile) {
      setCropTargetFile(mainOriginalFile);
      setCropTargetType('main');
      setCropAspectRatio(16/9);
      setCropModalOpen(true);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const totalUpcoming = existingGallery.length + galleryFiles.length + files.length;
      let allowedFiles = files;
      if (totalUpcoming > 10) {
        toast.error("Maksimal 10 foto galeri.");
        const allowedCount = Math.max(0, 10 - (existingGallery.length + galleryFiles.length));
        if (allowedCount === 0) return;
        allowedFiles = files.slice(0, allowedCount);
      }
      setCropTargetType('gallery');
      setCropAspectRatio(undefined);
      setCropQueue(allowedFiles);
      setCropTargetFile(allowedFiles[0]);
      setCropModalOpen(true);
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    
    if (cropTargetType === 'main') {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setCropModalOpen(false);
      setCropTargetFile(null);
    } else if (cropTargetType === 'gallery') {
      setGalleryFiles(prev => [...prev, file]);
      if (cropTargetFile) setGalleryOriginalFiles(prev => [...prev, cropTargetFile]);
      setGalleryPreviews(prev => [...prev, URL.createObjectURL(file)]);
      
    } else if (cropTargetType.startsWith('gallery-edit-')) {
      const index = parseInt(cropTargetType.split('-')[2]);
      setGalleryFiles(prev => {
        const arr = [...prev];
        arr[index] = file;
        return arr;
      });
      setGalleryPreviews(prev => {
        const arr = [...prev];
        arr[index] = URL.createObjectURL(file);
        return arr;
      });
      setCropModalOpen(false);
      setCropTargetFile(null);
    }
    
    if (cropTargetType === 'gallery') {
      const nextQueue = [...cropQueue];
      nextQueue.shift();
      if (nextQueue.length > 0) {
        setCropQueue(nextQueue);
        setCropTargetFile(nextQueue[0]);
      } else {
        setCropQueue([]);
        setCropTargetFile(null);
        setCropModalOpen(false);
      }
    }
  };

  const handleCropCancel = () => {
    if (cropTargetType === 'gallery') {
      const nextQueue = [...cropQueue];
      nextQueue.shift();
      if (nextQueue.length > 0) {
        setCropQueue(nextQueue);
        setCropTargetFile(nextQueue[0]);
      } else {
        setCropQueue([]);
        setCropTargetFile(null);
        setCropModalOpen(false);
      }
    } else {
      setCropTargetFile(null);
      setCropModalOpen(false);
    }
  };
  
  const removeGalleryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
    } else {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index));
      setGalleryOriginalFiles(prev => prev.filter((_, i) => i !== index));
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Mencegah Base64 Image (Copy Paste / Drag Drop)
    // Base64 memicu Vercel 500 Error (Payload Too Large) dan memberatkan database
    if (contentHtml.includes('data:image/')) {
      setError("DILARANG COPY-PASTE GAMBAR! ❌ Mohon hapus gambar yang baru saja Anda masukkan. Gunakan ikon 'Gambar' pada menu toolbar di atas untuk mengunggah foto dengan benar.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Convert datetime-local to ISO string or format required by DB
    const dateInput = formData.get('date_published') as string;
    if (dateInput) {
      formData.set('date_published', new Date(dateInput).toISOString());
    }
    
    startTransition(async () => {
      try {
        let finalImageUrl = initialData?.image_url || '';
        
        if (selectedFile) {
                  const webpFile = await compressImageToWebp(selectedFile);
                  finalImageUrl = await uploadToSupabase(webpFile, 'news');
        } else if (!initialData) {
          throw new Error('Gambar cover wajib diunggah');
        }

        formData.set('image_url', finalImageUrl);
        formData.append('content', contentHtml);

        let uploadedGalleryUrls: string[] = [];
        if (galleryFiles.length > 0) {
          const galleryPromises = galleryFiles.map(async (f) => {
            const webp = await compressImageToWebp(f);
            return await uploadToSupabase(webp, 'news');
          });
          uploadedGalleryUrls = await Promise.all(galleryPromises);
        }
        const finalGallery = [...existingGallery, ...uploadedGalleryUrls];
        formData.append('images', JSON.stringify(finalGallery));

        let result;
        if (initialData) {
          result = await updateNewsArticle(initialData.id, formData);
        } else {
          result = await createNewsArticle(formData);
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


  const handleInlineImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineImageFile || !inlineImageSource.trim()) {
      toast.error("Sumber foto wajib diisi!");
      return;
    }
    
    setInlineImageUploading(true);
    try {
      const webp = await compressImageToWebp(inlineImageFile);
      const url = await uploadToSupabase(webp, 'news');
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);
        const index = range ? range.index : 0;
        
        quill.insertEmbed(index, 'image', url);
        quill.insertText(index + 1, `\nSumber: ${inlineImageSource.trim()}\n`, { italic: true });
        quill.setSelection(index + 3 + inlineImageSource.trim().length + 9);
      }
      setInlineImageModalOpen(false);
      setInlineImageFile(null);
      setInlineImageSource("");
    } catch (error) {
      console.error("Gagal unggah gambar:", error);
      toast.error("Gagal mengunggah gambar ke dalam teks.");
    } finally {
      setInlineImageUploading(false);
    }
  };

  const defaultDate = initialData?.date_published 
    ? new Date(initialData.date_published).toISOString().slice(0, 16) 
    : new Date().toISOString().slice(0, 16);

  return (
    <>
      <ImageCropperModal 
        isOpen={cropModalOpen}
        imageFile={cropTargetFile}
        aspectRatio={cropAspectRatio} 
        onClose={handleCropCancel}
        onCropComplete={handleCropComplete}
      />
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form id="berita-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Cover (Wajib)</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-48 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-colors hover:bg-gray-50 ${previewImage ? 'border-gray-200' : 'border-[#3D7A5E]/30 bg-green-50/30'}`}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Ganti
                      </span>
                      {mainOriginalFile && (
                        <button 
                          type="button"
                          onClick={handleEditMainImage}
                          className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                      )}
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
                  onChange={handleMainImageChange}
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penulis (Author)</label>
                <input 
                  name="author" 
                  type="text" 
                  defaultValue={initialData?.author || 'Admin TIC Bandung'}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                  placeholder="Nama Penulis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peran Penulis (Role)</label>
                <input 
                  name="author_role" 
                  type="text" 
                  defaultValue={initialData?.author_role || 'Tim Redaksi'}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                  placeholder="Misal: Tim Redaksi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel</label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={initialData?.title || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Contoh: 5 Kafe Legendaris di Braga"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input 
                  name="category" 
                  type="text" 
                  required 
                  defaultValue={initialData?.category || ''}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                  placeholder="Misal: Kuliner Lokal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warna Label</label>
                <CustomSelect 
                  name="color_theme" 
                  defaultValue={initialData?.color_theme || 'emerald'}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                  options={[
                    { value: 'emerald', label: 'Hijau (Emerald)' },
                    { value: 'blue', label: 'Biru (Blue)' },
                    { value: 'amber', label: 'Kuning (Amber)' },
                    { value: 'rose', label: 'Merah (Rose)' },
                    { value: 'purple', label: 'Ungu (Purple)' },
                  ]}
                  placeholder="Pilih Warna"
                />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-[500px] mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Berita/Artikel</label>
              <div className="flex-1 bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#3D7A5E] focus-within:border-[#3D7A5E] transition-all [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-50 [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl">
                <ReactQuillAny 
                  ref={quillRef}
                  theme="snow" 
                  value={contentHtml} 
                  onChange={setContentHtml}
                  modules={modules}
                  className="h-full pb-10"
                  placeholder="Tulis isi berita atau artikel secara lengkap di sini..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Galeri Berita (Maks. 10 Foto)</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingGallery.map((url, i) => (
                  <div key={`ex-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryImage(i, true)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {galleryPreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                    <img src={preview} alt="New Gallery" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeGalleryImage(i, false); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setCropTargetFile(galleryOriginalFiles[i]); 
                        setCropTargetType(`gallery-edit-${i}`); 
                        setCropAspectRatio(undefined); 
                        setCropModalOpen(true); 
                      }}
                      className="absolute top-2 right-10 p-1.5 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-bold rounded">
                      BARU
                    </div>
                  </div>
                ))}
                
                {(existingGallery.length + galleryFiles.length) < 10 && (
                  <label className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#3D7A5E] hover:bg-green-50/30 cursor-pointer flex flex-col items-center justify-center transition-colors">
                    <Plus className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-500">Tambah Foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleGalleryChange}
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish</label>
              <input 
                name="date_published" 
                type="datetime-local" 
                required
                defaultValue={defaultDate}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
              />
            </div>
          </form>
        
        <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="berita-form"
            disabled={isPending}
            className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Simpan Perubahan' : 'Terbitkan Berita'}
          </button>
        </div>
      </div>
    </div>

      {inlineImageModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleInlineImageSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#3D7A5E]" />
                Sisipkan Gambar
              </h3>
              <button 
                type="button" 
                onClick={() => setInlineImageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {inlineImageFile && (
                <div className="w-full h-40 relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(inlineImageFile)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Sumber Foto <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  Beri tahu pembaca dari mana gambar ini berasal. <strong>Wajib diisi!</strong> Jika Anda tidak tahu sumbernya, ketik <span className="font-mono bg-gray-100 px-1 rounded">Tidak Diketahui</span> atau <span className="font-mono bg-gray-100 px-1 rounded">Dokumentasi Pribadi</span>.
                </p>
                <input 
                  type="text" 
                  required
                  value={inlineImageSource}
                  onChange={(e) => setInlineImageSource(e.target.value)}
                  placeholder="Misal: Dokumentasi TIC Bandung..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] focus:ring-2 focus:ring-[#3D7A5E]/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button" 
                onClick={() => setInlineImageModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={inlineImageUploading || !inlineImageSource.trim()}
                className="bg-[#3D7A5E] hover:bg-[#2c5c45] text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {inlineImageUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {inlineImageUploading ? 'Mengunggah...' : 'Sisipkan Gambar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

