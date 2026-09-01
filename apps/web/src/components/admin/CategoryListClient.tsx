"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { useState } from "react";
import { UploadCloud, Edit2, Trash2, Plus, X, Search } from "lucide-react";
import { updateCategoryAction, createCategoryAction, deleteCategoryAction } from "@/app/actions/category";
import { compressImageToWebp, uploadToSupabase } from "@/utils/imageUpload";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function CategoryListClient({ categories }: { categories: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPillar, setFilterPillar] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);
  const [cropTargetId, setCropTargetId] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropTargetFile(file);
      setCropTargetId(id);
      setCropModalOpen(true);
      e.target.value = ''; // reset
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    setCropModalOpen(false);
    setCropTargetFile(null);
    
    if (cropTargetId) {
      setLoadingId(cropTargetId);
      try {
        setLoadingMessage("Mengompresi gambar (WebP)...");
        const webpFile = await compressImageToWebp(file);
        const imageUrl = await uploadToSupabase(webpFile, "categories");

        const updateData = new FormData();
        updateData.append("image_url", imageUrl);

        const result = await updateCategoryAction(cropTargetId, updateData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Thumbnail kategori berhasil diperbarui!");
        }
      } catch (err: any) {
        toast.error("Gagal mengupload gambar: " + err.message);
      } finally {
        setLoadingId(null);
        setCropTargetId(null);
      }
    }
  };

  const handleCropCancel = () => {
    setCropTargetFile(null);
    setCropTargetId(null);
    setCropModalOpen(false);
  };

  const [editData, setEditData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    cluster: "rekreasi-publik",
    pillar: "explore",
    cluster_color: "#2C5C8A",
    description: ""
  });

  const clusters = [
    { value: "rekreasi-publik", label: "Rekreasi & Publik (Biru)", color: "#2C5C8A" },
    { value: "alam-taman", label: "Alam & Taman (Hijau)", color: "#3D7A5E" },
    { value: "edukasi-budaya", label: "Edukasi & Budaya (Emas)", color: "#C9971E" },
    { value: "seni", label: "Seni (Teal)", color: "#2C7A7A" },
    { value: "kuliner", label: "Kuliner (Oranye)", color: "#D4791E" },
    { value: "belanja", label: "Belanja (Merah Muda)", color: "#B5566B" },
    { value: "religi", label: "Religi (Coklat)", color: "#8C5A3C" }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingId(id);
    try {
      setLoadingMessage("Mengompresi gambar (WebP)...");
        const webpFile = await compressImageToWebp(file);
      const imageUrl = await uploadToSupabase(webpFile, "categories");

      const updateData = new FormData();
      updateData.append("image_url", imageUrl);

      const result = await updateCategoryAction(id, updateData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Thumbnail kategori berhasil diperbarui!");
      }
    } catch (err: any) {
      toast.error("Gagal mengupload gambar: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Yakin ingin menghapus kategori "${name}"? Pastikan tidak ada destinasi yang menggunakan kategori ini.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (!confirmResult.isConfirmed) return;
    
    setLoadingId(id);
    try {
      const res = await deleteCategoryAction(id);
      if (res.error) {
        toast.error(res.error);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSlugify = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const openModal = (category: any = null) => {
    if (category) {
      setEditData(category);
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        cluster: category.cluster || "rekreasi-publik",
        cluster_color: category.cluster_color || "#2C5C8A",
        pillar: category.pillar || "explore",
        description: category.description || ""
      });
    } else {
      setEditData(null);
      setFormData({
        name: "",
        slug: "",
        cluster: "rekreasi-publik",
    pillar: "explore",
        cluster_color: "#2C5C8A",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("cluster", formData.cluster);
      form.append("pillar", formData.pillar);
      form.append("cluster_color", formData.cluster_color);
      form.append("description", formData.description);

      if (editData) {
        const res = await updateCategoryAction(editData.id, form);
        if (res.error) toast.error(res.error);
        else setIsModalOpen(false);
      } else {
        const res = await createCategoryAction(form);
        if (res.error) toast.error(res.error);
        else setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
      setLoadingMessage(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <CustomSelect 
            value={filterPillar}
            onChange={(e) => setFilterPillar(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg text-sm !py-2"
            wrapperClassName="w-full sm:w-56"
            hidePlaceholderOption={true}
            options={[
              { value: 'ALL', label: 'Semua Pilar' },
              { value: 'stay', label: 'Where to Stay & Relax' },
              { value: 'explore', label: 'Things to Do & Explore' },
              { value: 'lifestyle', label: 'Lifestyle, Eat & Space' }
            ]}
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1b1c1a] text-white rounded-lg hover:bg-black transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.filter(cat => 
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (filterPillar === "ALL" || cat.pillar === filterPillar)
        ).map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col relative group">
            
            {/* Actions overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => openModal(cat)} className="p-2 bg-white text-gray-700 rounded-lg shadow hover:text-blue-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 bg-white text-gray-700 rounded-lg shadow hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-40 bg-gray-100 border-b border-gray-200">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Belum ada thumbnail</span>
                </div>
              )}
              
              {loadingId === cat.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Processing...</span>
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-[#1b1c1a] text-lg mb-1">{cat.name}</h3>
              <div className="flex gap-2 text-xs mb-4">
                <span className="px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: cat.cluster_color || "#333" }}>
                  {cat.cluster}
                </span>
                <span className="text-gray-500 py-0.5">{cat.slug}</span>
              </div>
              {cat.description && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{cat.description}</p>}
              
              <div className="mt-auto">
                <label className="w-full py-2 flex items-center justify-center gap-2 bg-[#f6f3f0] hover:bg-[#e8e2d9] transition-colors border border-gray-200 rounded-lg text-sm font-medium text-[#1b1c1a] cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  Ganti Thumbnail
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, cat.id)}
                    className="hidden"
                    disabled={loadingId === cat.id}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#1b1c1a]">
                {editData ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={submitForm} className="overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({...formData, name, slug: handleSlugify(name)});
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                  placeholder="Misal: Wisata Buatan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: handleSlugify(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilar Utama (Halaman Publik) *</label>
                <select 
                  required
                  value={formData.pillar}
                  onChange={(e) => setFormData({...formData, pillar: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-4"
                >
                  <option value="stay">Where to Stay & Relax</option>
                  <option value="explore">Things to Do & Explore</option>
                  <option value="lifestyle">Lifestyle, Eat & Space</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cluster Warna *</label>
                <select 
                  required
                  value={formData.cluster}
                  onChange={(e) => {
                    const cluster = e.target.value;
                    const color = clusters.find(c => c.value === cluster)?.color || "#333";
                    setFormData({...formData, cluster, cluster_color: color});
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {clusters.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-24 resize-none" 
                  placeholder="Opsional"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1b1c1a] hover:bg-black rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}



