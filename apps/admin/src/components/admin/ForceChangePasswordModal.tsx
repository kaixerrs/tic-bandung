"use client";

import { useState, useTransition } from 'react';
import { updateAdminPassword } from '@/app/actions/admin';
import { Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ForceChangePasswordModal({ 
  isOpen 
}: { 
  isOpen: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    startTransition(async () => {
      const result = await updateAdminPassword(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Sandi diubah! Silakan login kembali dengan sandi baru.', { duration: 4000 });
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-amber-500 text-white flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">Keamanan Akun</h2>
          <p className="text-amber-50 text-sm">Anda diwajibkan untuk mengganti kata sandi bawaan demi keamanan sistem.</p>
        </div>
        
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pembaruan Berhasil</h3>
              <p className="text-gray-500 text-sm mb-4">Silakan login kembali dengan sandi baru Anda.<br/>Mengarahkan ke halaman login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Silakan buat kata sandi baru yang kuat untuk akun admin Anda. Anda tidak dapat mengakses dashboard sebelum mengubah kata sandi.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  name="confirm_password"
                  required
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-black"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Kata Sandi'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
