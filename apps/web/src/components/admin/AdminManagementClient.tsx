"use client";
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, UserPlus, Shield, User, Loader2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { id } from 'date-fns/locale';
import { createNewAdmin, deleteAdmin } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

type AdminUser = {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  last_seen?: string;
};

export default function AdminManagementClient({ admins, currentUserEmail }: { admins: AdminUser[], currentUserEmail: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    const res = await createNewAdmin(formData);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      reset();
      setIsAdding(false);
      router.refresh();
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (userId: string, email: string) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Yakin ingin menghapus admin ${email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });
    if (confirmResult.isConfirmed) {
      const res = await deleteAdmin(userId, email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-display font-medium text-[#2d2a26] tracking-tight">Manajemen Admin</h1>
          <p className="text-[#8a857e] mt-1 text-sm md:text-base">Kelola akses dan daftar administrator web.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#3D7A5E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2c5a45] transition-colors"
        >
          {isAdding ? <span className="font-bold">Batal</span> : <><UserPlus className="w-4 h-4" /> Tambah Admin Baru</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Form Tambah Admin</h2>
          
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                {...register("email", { required: "Email wajib diisi" })}
                type="email" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#3D7A5E]"
                placeholder="email@ticbandung.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                {...register("password", { required: "Password wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })}
                type="password" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#3D7A5E]"
                placeholder="Minimal 6 karakter"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peran Akses (Role)</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="ADMIN" defaultChecked {...register("role")} className="text-[#3D7A5E]" />
                  <span className="text-sm">Admin Biasa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="SUPER_ADMIN" {...register("role")} className="text-[#C9971E]" />
                  <span className="text-sm font-semibold text-[#C9971E]">Super Admin</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#1b1c1a] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Peran (Role)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tanggal Bergabung</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Terakhir Dilihat</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${admin.role === 'SUPER_ADMIN' ? 'bg-[#C9971E]/10' : 'bg-[#3D7A5E]/10'}`}>
                        {admin.role === 'SUPER_ADMIN' ? (
                          <Shield className={`w-4 h-4 text-[#C9971E]`} />
                        ) : (
                          <User className={`w-4 h-4 text-[#3D7A5E]`} />
                        )}
                      </div>
                      <span className="font-medium text-gray-800">
                        {admin.email}
                        {admin.email === currentUserEmail && <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Anda</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.role === 'SUPER_ADMIN' ? (
                      <span className="text-xs font-bold text-[#C9971E] bg-[#C9971E]/10 px-2.5 py-1 rounded-full uppercase">Super Admin</span>
                    ) : (
                      <span className="text-xs font-semibold text-[#3D7A5E] bg-[#3D7A5E]/10 px-2.5 py-1 rounded-full uppercase">Admin</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(admin.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.last_seen && differenceInMinutes(new Date(), new Date(admin.last_seen)) <= 2 ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Offline
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                    {admin.last_seen 
                      ? formatDistanceToNow(new Date(admin.last_seen), { addSuffix: true, locale: id })
                      : 'Belum pernah login'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {admin.email !== currentUserEmail && (
                      <button 
                        onClick={() => handleDelete(admin.user_id, admin.email)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data admin ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
