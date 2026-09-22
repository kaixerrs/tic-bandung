"use client";

import { useState, useTransition, useRef } from 'react';
import { updateAdminProfile, updateAdminPassword } from '@/app/actions/admin';
import { User, Lock, Camera, Save, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { compressImageToWebp } from '@/utils/imageUpload';
import ImageCropperModal from '@/components/ui/ImageCropperModal';
import DeviceSessions from './DeviceSessions';
import { toast } from 'react-hot-toast';

export default function AdminProfileForm({ initialProfile }: { initialProfile: any }) {
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);
  

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Ukuran foto maksimal 4MB');
        return;
      }
      setSelectedFileForCrop(file);
      setIsCropModalOpen(true);
      if (e.target) e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(croppedBlob));
    
    setIsCropModalOpen(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // We cannot use startTransition directly around the compression because it's an async operation that takes time before the transition.
    // Instead, we will set a local loading state or just run it. startProfileTransition wraps the server action.
    
    startProfileTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('display_name', displayName);
        if (initialProfile?.avatar_url) {
          formData.append('current_avatar_url', initialProfile.avatar_url);
        }
        
        if (avatarFile) {
          toast.loading('Mengompresi foto...', { id: 'compress' });
          const compressedFile = await compressImageToWebp(avatarFile, 800, 0.8);
          formData.append('avatar_file', compressedFile);
          toast.dismiss('compress');
        }

        const result = await updateAdminProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Profil berhasil diperbarui!');
      }
      } catch (err: any) {
        toast.dismiss('compress');
        toast.error('Gagal mengompresi atau menyimpan profil');
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      toast.error('Kata sandi dan konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (password.length < 6) {
      toast.error('Kata sandi minimal 6 karakter!');
      return;
    }

    startPasswordTransition(async () => {
      const result = await updateAdminPassword(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Sandi diubah! Silakan login kembali dengan sandi baru.', { duration: 4000 });
        (e.target as HTMLFormElement).reset();
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      <ImageCropperModal
        isOpen={isCropModalOpen}
        imageFile={selectedFileForCrop}
        aspectRatio={1}
        title="Sesuaikan Foto Profil"
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleCropComplete}
      />
      {/* Profile Section */}
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Informasi Dasar</h2>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden group">
                  {avatarUrl ? (
                    <img 
                      key={avatarUrl}
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover relative z-0" 
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                  <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-semibold text-[#3D7A5E] hover:text-[#2d5c47] transition-colors"
                >
                  Ubah Foto
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Tampilan</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Masukkan nama tampilan Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Nama ini akan ditampilkan di menu sidebar dan log aktivitas.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isProfilePending}
                className="bg-[#3D7A5E] hover:bg-[#2d5c47] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#3D7A5E]/20"
              >
                {isProfilePending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Section */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden h-full flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Ubah Kata Sandi</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  required
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isPasswordPending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPasswordPending ? 'Menyimpan...' : 'Perbarui Sandi'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
      <DeviceSessions />
    </div>
  );
}
