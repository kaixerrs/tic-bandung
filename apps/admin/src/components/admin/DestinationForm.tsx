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
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Category = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  category_id: string;
  description: string;
  content: string;
  address: string;
  district: string;
  lat: string;
  lng: string;
  ticket_type: "FREE" | "PAID" | "UNCONFIRMED";
  ticket_nominal?: string;
  opening_hours: string;
  founded_year: string;
  source_photo_credit: string;
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

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      ticket_type: "UNCONFIRMED",
    },
  });

  const contentValue = watch("content");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);
  const [cropTargetType, setCropTargetType] = useState<'main' | 'gallery'>('main');
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(16/9);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropTargetFile(file);
      setCropTargetType('main');
      setCropAspectRatio(16/9);
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert Blob back to File
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    
    if (cropTargetType === 'main') {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCropModalOpen(false);
      setCropTargetFile(null);
    } else if (cropTargetType === 'gallery') {
      setGalleryFiles(prev => [...prev, file]);
      setGalleryPreviews(prev => [...prev, URL.createObjectURL(file)]);
      
      const nextQueue = [...cropQueue];
      nextQueue.shift(); // remove the one we just processed
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


  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;
  type DaySchedule = { active: boolean; open: string; close: string };
  const [scheduleMap, setScheduleMap] = useState<Record<string, DaySchedule>>(
    Object.fromEntries(DAYS.map(d => [d, { active: false, open: '08:00', close: '17:00' }]))
  );

  const syncScheduleToForm = (map: Record<string, DaySchedule>) => {
    const result: Record<string, string> = {};
    Object.entries(map).forEach(([day, sched]) => {
      if (sched.active) result[day] = `${sched.open} - ${sched.close}`;
    });
    setValue('opening_hours', Object.keys(result).length > 0 ? JSON.stringify(result) : '');
  };

  const toggleDay = (day: string) => {
    setScheduleMap(prev => {
      const updated = { ...prev, [day]: { ...prev[day], active: !prev[day].active } };
      syncScheduleToForm(updated);
      return updated;
    });
  };

  const updateTime = (day: string, field: 'open' | 'close', value: string) => {
    setScheduleMap(prev => {
      const updated = { ...prev, [day]: { ...prev[day], [field]: value } };
      syncScheduleToForm(updated);
      return updated;
    });
  };

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        category_id: initialData.category_id || "",
        description: initialData.description || "",
        content: initialData.content || "",
        address: initialData.address || "",
        district: initialData.district || "",
        lat: initialData.lat ? initialData.lat.toString() : "",
        lng: initialData.lng ? initialData.lng.toString() : "",
        ticket_type: initialData.price_info ? (JSON.parse(initialData.price_info).type || "UNCONFIRMED") : "UNCONFIRMED",
        ticket_nominal: initialData.price_info ? (JSON.parse(initialData.price_info).nominal || "") : "",
        opening_hours: initialData.opening_hours ? (typeof initialData.opening_hours === 'string' ? initialData.opening_hours : JSON.stringify(initialData.opening_hours)) : "",
        founded_year: initialData.founded_year ? initialData.founded_year.toString() : "",
        source_photo_credit: initialData.source_photo_credit || "",
        leaflet_url: initialData.leaflet_url || "",
      });

      // Parse existing opening_hours into visual schedule map
      if (initialData.opening_hours) {
        try {
          const parsed = typeof initialData.opening_hours === 'string'
            ? JSON.parse(initialData.opening_hours)
            : initialData.opening_hours;
          const newMap = { ...Object.fromEntries(DAYS.map(d => [d, { active: false, open: '08:00', close: '17:00' }])) };
          Object.entries(parsed).forEach(([day, timeRange]) => {
            const [open, close] = (timeRange as string).split(' - ');
            if (newMap[day]) {
              newMap[day] = { active: true, open: open?.trim() || '08:00', close: close?.trim() || '17:00' };
            }
          });
          setScheduleMap(newMap);
        } catch { /* keep defaults */ }
      }

      if (initialData.images && initialData.images.length > 0) {
        setImagePreview(initialData.images[0]);
        if (initialData.images.length > 1) {
          setExistingGallery(initialData.images.slice(1));
        }
      }
    }
  }, [initialData, reset]);

  const watchTicketType = watch("ticket_type");

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const totalUpcoming = existingGallery.length + galleryFiles.length + files.length;
      let allowedFiles = files;
      
      if (totalUpcoming > 10) {
        toast.error("Maksimal 10 foto galeri diperbolehkan.");
        const allowedCount = Math.max(0, 10 - (existingGallery.length + galleryFiles.length));
        if (allowedCount === 0) return;
        allowedFiles = files.slice(0, allowedCount);
      }
      
      setGalleryFiles(prev => [...prev, ...allowedFiles]);
      const newPreviews = allowedFiles.map(f => URL.createObjectURL(f));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingGallery = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewGallery = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

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
        toast.error("Foto utama wajib diunggah untuk destinasi baru (NFR-16).");
        setIsSubmitting(false);
      setLoadingMessage(null);
        return;
      }

      let finalImageUrl = "";
      let uploadedGalleryUrls: string[] = [];

      // 1. If there's a new image, compress to WebP and upload
      if (imageFile) {
        setLoadingMessage("Mengompresi foto utama (WebP)...");
        const webpFile = await compressImageToWebp(imageFile);
        setLoadingMessage("Mengunggah foto utama...");
        finalImageUrl = await uploadToSupabase(webpFile, 'destinations');
      }

      // 1b. Upload gallery files
      if (galleryFiles.length > 0) {
        setLoadingMessage(`Mengompresi ${galleryFiles.length} foto galeri (WebP)...`);
        for (let i = 0; i < galleryFiles.length; i++) {
          const wFile = await compressImageToWebp(galleryFiles[i]);
          setLoadingMessage(`Mengunggah galeri ${i+1} dari ${galleryFiles.length}...`);
          const gUrl = await uploadToSupabase(wFile, 'destinations');
          uploadedGalleryUrls.push(gUrl);
        }
      }

      // 2. Prepare Payload
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
      
      const finalGalleryUrls = [...existingGallery, ...uploadedGalleryUrls];
      if (finalGalleryUrls.length > 0) {
        formData.append("gallery_urls", JSON.stringify(finalGalleryUrls));
      }

      // 3. Submit to Action
      let result;
      if (isEditMode) {
        result = await updateDestinationAction(initialData.id, formData);
      } else {
        result = await createDestinationAction(formData);
      }
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Destinasi berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}!`);
      
      router.push("/admin/destinasi");
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat menyimpan destinasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-sm border border-[#d3c5af]/50 p-6 md:p-8">
      
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Informasi Utama</h2>
        <p className="text-sm text-[#4f4635]">Data dasar tentang destinasi wisata.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Nama Destinasi *</label>
            <input 
              {...register("name", { required: "Nama wajib diisi" })} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Contoh: Museum Geologi"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Kategori *</label>
            <CustomSelect 
              {...register("category_id", { required: "Kategori wajib dipilih" })}
              className="w-full bg-gray-50 border-gray-200"
              placeholder="-- Pilih Kategori --"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
            />
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Deskripsi Singkat</label>
            <textarea 
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Jelaskan daya tarik destinasi ini secara singkat..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Konten Halaman Detail</label>
            <div className="bg-white text-gray-900 rounded-lg border border-gray-200 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[300px]">
              <ReactQuill 
                theme="snow" 
                value={contentValue || ""} 
                onChange={(val) => setValue("content", val)}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                placeholder="Tuliskan konten lengkap untuk halaman detail destinasi..."
              />
            </div>
            {/* We register the hidden input just to make sure it's part of the form errors if any, although ReactQuill manages state */}
            <input type="hidden" {...register("content")} />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Lokasi & Pemetaan (NFR-10)</h2>
        <div className="bg-[#3D7A5E]/10 border border-[#3D7A5E]/20 p-4 rounded-lg flex gap-3 items-start mb-6">
          <Info className="w-5 h-5 text-[#3D7A5E] shrink-0 mt-0.5" />
          <p className="text-sm text-[#3D7A5E] leading-relaxed">
            Sistem akan mendeteksi otomatis jika titik koordinat (Latitude/Longitude) yang Anda masukkan berada kurang dari 10 meter dari destinasi lain yang sudah terdaftar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Alamat Lengkap *</label>
            <input 
              {...register("address", { required: "Alamat wajib diisi" })} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none" 
              placeholder="Jl. Diponegoro No.57, Cihaur Geulis..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Kecamatan</label>
            <input 
              {...register("district")} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none" 
              placeholder="Contoh: Cibeunying Kaler"
            />
          </div>
          <div></div>
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Latitude *</label>
            <input 
              {...register("lat", { required: "Latitude wajib diisi" })} 
              type="number" step="any"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none font-mono text-sm" 
              placeholder="-6.900277"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Longitude *</label>
            <input 
              {...register("lng", { required: "Longitude wajib diisi" })} 
              type="number" step="any"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none font-mono text-sm" 
              placeholder="107.618611"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Informasi Tiket & Operasional (NFR-09)</h2>
        <p className="text-sm text-[#4f4635] mb-6">Penentuan status harga secara eksplisit agar sistem membedakan Gratis dan Belum Konfirmasi.</p>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-sm font-semibold text-[#1b1c1a] mb-4">Status Harga Tiket Masuk *</label>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="UNCONFIRMED" {...register("ticket_type")} className="w-4 h-4 text-[#3D7A5E] focus:ring-[#3D7A5E]" />
                <span className="text-sm text-gray-700">Belum Terkonfirmasi (Disembunyikan di UI)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="FREE" {...register("ticket_type")} className="w-4 h-4 text-[#3D7A5E] focus:ring-[#3D7A5E]" />
                <span className="text-sm text-gray-700">Gratis (Ditampilkan "Gratis")</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="PAID" {...register("ticket_type")} className="w-4 h-4 text-[#3D7A5E] focus:ring-[#3D7A5E]" />
                <span className="text-sm text-gray-700">Berbayar</span>
              </label>
            </div>

            {watchTicketType === "PAID" && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Nominal Harga (Rp) *</label>
                <input 
                  {...register("ticket_nominal", { required: watchTicketType === "PAID" ? "Nominal wajib diisi jika berbayar" : false })} 
                  type="number"
                  className="w-full sm:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none font-mono" 
                  placeholder="Contoh: 25000"
                />
                {errors.ticket_nominal && <p className="text-red-500 text-xs mt-1">{errors.ticket_nominal.message}</p>}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1b1c1a] mb-4">Jam Operasional</label>
              <div className="space-y-2">
                {DAYS.map(day => (
                  <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer w-28 shrink-0">
                      <input
                        type="checkbox"
                        checked={scheduleMap[day].active}
                        onChange={() => toggleDay(day)}
                        className="w-4 h-4 rounded text-[#3D7A5E] focus:ring-[#3D7A5E]"
                      />
                      <span className={`text-sm font-medium ${scheduleMap[day].active ? 'text-[#1b1c1a]' : 'text-gray-400'}`}>{day}</span>
                    </label>
                    {scheduleMap[day].active ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={scheduleMap[day].open}
                          onChange={(e) => updateTime(day, 'open', e.target.value)}
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D7A5E]"
                        />
                        <span className="text-gray-400 text-sm">s/d</span>
                        <input
                          type="time"
                          value={scheduleMap[day].close}
                          onChange={(e) => updateTime(day, 'close', e.target.value)}
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D7A5E]"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Tutup</span>
                    )}
                  </div>
                ))}
              </div>
              <input type="hidden" {...register("opening_hours")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Tahun Berdiri</label>
              <input 
                {...register("founded_year")} 
                type="number"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none" 
                placeholder="Contoh: 1920"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Link Google Drive Leaflet (Opsional)</label>
              <input 
                {...register("leaflet_url")} 
                type="url"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none" 
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1b1c1a] mb-2">Aset Visual (NFR-11)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Foto Utama {isEditMode ? '' : '*'}</label>
            {imagePreview ? (
              <div>
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#1b1c1a] hover:bg-gray-50 transition-colors cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  Ganti Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center overflow-hidden cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-500">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Pilih atau letakkan foto</span>
                </div>
              </div>
            )}
          </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Galeri Foto Tambahan</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingGallery.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative w-full h-24 rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingGallery(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((url, idx) => (
                  <div key={`new-${idx}`} className="relative w-full h-24 rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewGallery(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <label className="relative w-full h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500">
                  <UploadCloud className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Tambah Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          <div>
            <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Kredit / Sumber Foto *</label>
            <p className="text-xs text-gray-500 mb-2">Wajib diisi untuk audit hak cipta aset (NFR-11). Contoh: "Dinas Pariwisata Bandung" atau "Unsplash by John Doe".</p>
            <input 
              {...register("source_photo_credit", { required: "Kredit foto wajib diisi" })} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-[#3D7A5E] focus:ring-1 focus:ring-[#3D7A5E] outline-none" 
              placeholder="Sumber / Fotografer..."
            />
            {errors.source_photo_credit && <p className="text-red-500 text-xs mt-1">{errors.source_photo_credit.message}</p>}
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
          {isSubmitting ? (loadingMessage || "Memproses...") : (isEditMode ? "Perbarui & Publish" : "Publish Destinasi")}
        </button>
      </div>
    </form>
  );
}
