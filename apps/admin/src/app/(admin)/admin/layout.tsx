import React from 'react';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { checkIsSuperAdmin, getCurrentAdminProfile } from '@/app/actions/admin';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Jika tidak ada sesi (contoh: di halaman login), jangan tampilkan sidebar
  if (!session) {
    return <>{children}</>;
  }

  const isSuperAdmin = await checkIsSuperAdmin();
  const { data: profile } = await getCurrentAdminProfile();

  return (
    <AdminLayoutWrapper 
      isSuperAdmin={isSuperAdmin}
      userEmail={session.user.email}
      profile={profile}
    >
      {children}
    </AdminLayoutWrapper>
  );
}
