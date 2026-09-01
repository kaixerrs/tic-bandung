"use client";
import { toast } from 'react-hot-toast';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, MapPin, UploadCloud, Info, CheckCircle } from "lucide-react";
import { createEventAction, updateEventAction } from "@/app/actions/event";
import { compressImageToWebp, uploadToSupabase } from "@/utils/imageUpload";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/CustomSelect";

type Destination = {
  id: string;
  name: string;
};

type FormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  destination_id?: string;
  organizer: string;
  location: string;
  pic_name: string;
  whatsapp: string;
  email: string;
  instagram: string;
  kol_partner: string;
  artist_performance: string;
  usp: string;
  target_visitors: string;
  execution_count: string;
  promotion_media: string;
  attachment_link: string;
  commitment_letter_link: string;
};

export default function EventForm({ 
  destinations, 
  initialData 
}: { 
  destinations: Destination[], 
  initialData?: any 
}) {
  const isEditMode = !!initialData;
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropTargetFile(file);
      setCropModalOpen(true);
      e.target.value = ''; // reset
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setCropModalOpen(false);
    setCropTargetFile(null);
  };

  const handleCropCancel = () => {
    setCropTargetFile(null);
    setCropModalOpen(false);
  };


  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
        destination_id: initialData.destination_id || "",
        organizer: initialData.organizer || "",
        location: initialData.location || "",
        pic_name: initialData.pic_name || "",
        whatsapp: initialData.whatsapp || "",
        email: initialData.email || "",
        instagram: initialData.instagram || "",
        kol_partner: initialData.kol_partner || "",
        artist_performance: initialData.artist_performance || "",
        usp: initialData.usp || "",
        target_visitors: initialData.target_visitors ? initialData.target_visitors.toString() : "",
        execution_count: initialData.execution_count ? initialData.execution_count.toString() : "",
        promotion_media: initialData.promotion_media || "",
        attachment_link: initialData.attachment_link || "",
        commitment_letter_link: initialData.commitment_letter_link || "",
      });

      if (initialData.images && initialData.images.length > 0) {
        setImagePreview(initialData.images[0]);
      }
    }
  }, [initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const onSubmit = async (data: FormData, status: "draft" | "published") => {
    setIsSubmitting(true);
    setLoadingMessage("Menyiapkan data...");
    try {
      if (!isEditMode && !imageFile) {
        toast.error("Poster/Foto event wajib diunggah untuk event baru.");
        setIsSubmitting(false);
      setLoadingMessage(null);
        return;
      }

      let finalImageUrl = "";

      if (imageFile) {
        setLoadingMessage("Mengompresi gambar (WebP)...");
        const webpFile = await compressImageToWebp(imageFile);
        setLoadingMessage("Mengunggah gambar...");
        finalImageUrl = await uploadToSupabase(webpFile, 'events');
      }

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const val = data[key as keyof FormData];
        if (val !== undefined && val !== "") {
          formData.append(key, val as string);
        }
      });
      formData.append("status", status);
      
      if (finalImageUrl) {
        formData.append("image_url", finalImageUrl);
      }

      let result;
      if (isEditMode) {
        result = await updateEventAction(initialData.id, formData);
      } else {
        result = await createEventAction(formData);
      }
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Event berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}!`);
      
      router.push("/admin/event");
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat menyimpan event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-sm border border-[#d3c5af]/50 p-6 md:p-8">
      
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Informasi Event</h2>
        <p className="text-sm text-[#4f4635]">Data dasar tentang acara yang akan diselenggarakan.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Judul Event *</label>
            <input 
              {...register("title", { required: "Judul wajib diisi" })} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Contoh: Bandung Light Festival 2024"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Deskripsi Lengkap *</label>
            <textarea 
              {...register("description", { required: "Deskripsi wajib diisi" })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Jelaskan detail kegiatan, daya tarik, dll..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Penyelenggara / Organizer</label>
            <input 
              {...register("organizer")} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Contoh: Dinas Kebudayaan dan Pariwisata"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Waktu & Lokasi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Waktu Mulai *</label>
            <input 
              type="datetime-local"
              {...register("start_date", { required: "Waktu mulai wajib diisi" })} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
          </div>
          
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Waktu Selesai</label>
            <input 
              type="datetime-local"
              {...register("end_date")} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Lokasi Destinasi Wisata</label>
            <p className="text-xs text-gray-500 mb-2">Pilih destinasi jika event ini diadakan di area destinasi wisata terdaftar. Kosongkan jika di area umum.</p>
            <CustomSelect 
              {...register("destination_id")}
              className="w-full bg-gray-50 border-gray-200"
              placeholder="-- Tidak Terikat pada Destinasi Tertentu --"
              options={destinations.map(d => ({ value: d.id, label: d.name }))}
            />
          </div>
        
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Lokasi Terperinci (Tempat Acara) *</label>
            <input 
              {...register("location", { required: "Lokasi wajib diisi" })} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
              placeholder="Contoh: Kiara Artha Park"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Informasi Penanggung Jawab (PIC)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Nama Penanggung Jawab *</label>
            <input 
              {...register("pic_name", { required: "Wajib diisi" })} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Nomor WhatsApp *</label>
            <input 
              {...register("whatsapp", { required: "Wajib diisi" })} 
              type="tel"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Email *</label>
            <input 
              {...register("email", { required: "Wajib diisi" })} 
              type="email"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Detail Spesifik & Promosi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Akun Instagram Acara</label>
            <input 
              {...register("instagram")} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
              placeholder="@nama.ig"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Mitra KOL</label>
            <input 
              {...register("kol_partner")} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Pertunjukan Artis (Line Up)</label>
            <input 
              {...register("artist_performance")} 
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Nilai Jual Unik (USP) *</label>
            <textarea 
              {...register("usp", { required: "Wajib diisi" })} 
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none resize-none" 
            ></textarea>
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Target Pengunjung *</label>
            <input 
              {...register("target_visitors", { required: "Wajib diisi" })} 
              type="number"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Pelaksanaan Ke-berapa? *</label>
            <input 
              {...register("execution_count", { required: "Wajib diisi" })} 
              type="number"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Berkas Lampiran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Media Promosi (Google Drive Link) *</label>
            <input 
              {...register("promotion_media", { required: "Wajib diisi" })} 
              type="url"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Link File Proposal/Poster</label>
            <input 
              {...register("attachment_link")} 
              type="url"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#1b1c1a] mb-2">Link Surat Kesediaan</label>
            <input 
              {...register("commitment_letter_link")} 
              type="url"
              className="w-full px-4 py-3 bg-gray-50 text-base border border-gray-200 rounded-lg outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Aset Visual</h2>
        <div className="mt-6">
          <label className="block text-base font-bold text-[#1b1c1a] mb-2">Poster / Foto Event {isEditMode ? '' : '*'}</label>
          <div className="relative w-full md:w-1/2 h-80 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center overflow-hidden cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-500">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Unggah Poster Event</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button 
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, "draft"))}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (loadingMessage || "Memproses...") : "Simpan ke Draft"}
        </button>
        <button 
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, "published"))}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#3D7A5E] text-white font-bold hover:bg-[#2e5e48] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          {isSubmitting ? (loadingMessage || "Memproses...") : (isEditMode ? "Perbarui & Publish" : "Publish Event")}
        </button>
      </div>
    </form>
  );
}

