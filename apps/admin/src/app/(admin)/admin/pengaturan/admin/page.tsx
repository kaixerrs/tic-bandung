import React from 'react';
import { getAdminsList, checkIsSuperAdmin } from '@/app/actions/admin';
import { createClient } from '@/utils/supabase/server';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import AdminManagementClient from '@/components/admin/AdminManagementClient';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminManagementPage() {
  const isSuperAdmin = await checkIsSuperAdmin();
  
  if (!isSuperAdmin) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 max-w-md mb-8">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya diperuntukkan bagi <strong>Super Admin</strong>.
          </p>
          <Link href="/admin/dashboard" className="bg-[#1b1c1a] text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Kembali ke Dashboard
          </Link>
        </div>
      </>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserEmail = user?.email || "";

  const { data: admins, error } = await getAdminsList();

  if (error || !admins) {
    return (
      <>
        <div className="w-full max-w-6xl mx-auto py-4">
          <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
            <p className="font-bold">Gagal memuat daftar admin.</p>
            <p className="text-sm mt-1">{typeof error === 'string' ? error : (error as any)?.message || 'Terjadi kesalahan'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto py-4">
        <AdminManagementClient admins={admins} currentUserEmail={currentUserEmail} />
      </div>
    </>
  );
}
