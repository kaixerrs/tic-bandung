
"use client";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, CheckCircle, Info, X } from "lucide-react";
import { createDestinationAction, updateDestinationAction } from "@/app/actions/destination";
import { compressImageToWebp, uploadToSupabase } from "@/utils/imageUpload";
import { CustomSelect } from "@/components/ui/CustomSelect";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  category_id: string;
  leaflet_url: string;
};

export default function DestinationForm({ 
  categories, 
  initialData 
}: { 
  categories: Category[], 
  initialData?: any 
}) {
  const isEditMode = !!initialData;
  const router = useRouter();

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormData>();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropTargetFile(file);
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setCropModalOpen(false);
    setCropTargetFile(null);
  };

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name || "");
      setValue("category_id", initialData.category_id || "");
      setValue("leaflet_url", initialData.leaflet_url || "");
      if (initialData.image_url) setImagePreview(initialData.image_url);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!isEditMode && !imageFile) {
      toast.error("Gambar sampul (cover) wajib diunggah.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append("name", data.name);
      submitData.append("category_id", data.category_id);
      submitData.append("leaflet_url", data.leaflet_url);
      
      // Dummy empty values for removed fields to avoid db null constraints if any
      submitData.append("description", "");
      submitData.append("content", "");
      submitData.append("address", "");
      submitData.append("district", "");
      submitData.append("lat", "");
      submitData.append("lng", "");
      submitData.append("ticket_type", "UNCONFIRMED");
      submitData.append("opening_hours", "");

      if (imageFile) {
        const webpImage = await compressImageToWebp(imageFile);
        const imageUrl = await uploadToSupabase(webpImage, 'destinations');
        submitData.append("image_url", imageUrl);
      }

      let result;
      if (isEditMode) {
        result = await updateDestinationAction(initialData.id, submitData);
      } else {
        result = await createDestinationAction(submitData);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditMode ? "Destinasi diperbarui!" : "Destinasi ditambahkan!");
        router.push("/admin/destinasi");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900">
            {isEditMode ? 'Edit Destinasi (Simple)' : 'Tambah Destinasi Baru (Simple)'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Isi nama, kategori, foto sampul, dan link GDrive leaflet.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="max-w-3xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Destinasi <span className="text-red-500">*</span></label>
              <input 
                {...register("name", { required: "Nama wajib diisi" })} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none transition-all" 
                placeholder="Contoh: Gedung Sate" 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori <span className="text-red-500">*</span></label>
              <CustomSelect
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                value={watch("category_id")}
                onChange={(e) => setValue("category_id", e.target.value, { shouldValidate: true })}
                placeholder="Pilih Kategori"
              />
              <input type="hidden" {...register("category_id", { required: "Kategori wajib dipilih" })} />
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Gambar Sampul (Cover Card) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="relative w-full h-56 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center">
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm"><UploadCloud className="w-5 h-5"/> Ganti Foto</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">Klik atau drag foto ke sini</p>
                      <p className="text-xs text-gray-500 mt-1">Otomatis dioptimasi (WebP)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Link Leaflet (Google Drive) <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                {...register("leaflet_url", { required: "Link Leaflet wajib diisi" })} 
                className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none transition-all" 
                placeholder="https://drive.google.com/file/d/..." 
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
            </div>
            {errors.leaflet_url && <p className="text-red-500 text-xs mt-1">{errors.leaflet_url.message}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Pengunjung akan langsung diarahkan ke link ini saat mengklik destinasi. Pastikan link Google Drive sudah diatur ke "Anyone with the link can view".
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/admin/destinasi")} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            Batal
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold text-white bg-[#3D7A5E] hover:bg-[#2C5A45] shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>Mempersiapkan... <span className="animate-spin text-lg leading-none">↻</span></>
            ) : (
              <><CheckCircle className="w-5 h-5" /> Simpan Destinasi</>
            )}
          </button>
        </div>
      </form>

      <ImageCropperModal
        isOpen={cropModalOpen}
        imageFile={cropTargetFile}
        aspectRatio={16/9}
        onClose={() => { setCropModalOpen(false); setCropTargetFile(null); }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
