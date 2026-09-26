import React from 'react';
import { getCurrentAdminProfile } from '@/app/actions/admin';
import AdminProfileForm from '@/components/admin/AdminProfileForm';
import { User, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profil Admin | TIC Kota Bandung',
};

export default async function AdminProfilePage() {
  const { data: profile } = await getCurrentAdminProfile();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <User className="w-8 h-8 text-[#3D7A5E]" />
          Pengaturan Profil
        </h1>
        <p className="text-gray-500 mt-2">Kelola informasi profil pribadi dan keamanan akun Anda.</p>
      </div>

      <AdminProfileForm initialProfile={profile} />
    </div>
  );
}
