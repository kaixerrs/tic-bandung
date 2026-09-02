"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "./log";

// Create a Supabase client with the Service Role Key for Admin operations
const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function checkIsSuperAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: roleData } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return roleData?.role === 'SUPER_ADMIN';
}

export async function getAdminsList() {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) {
    return { error: "Unauthorized. Anda bukan Super Admin." };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('admin_roles')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function createNewAdmin(formData: FormData) {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) {
    return { error: "Unauthorized. Hanya Super Admin yang dapat menambahkan admin baru." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // 'SUPER_ADMIN' or 'ADMIN'

  if (!email || !password || !role) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    const adminSupabase = getAdminSupabase();

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto confirm for admins
    });

    if (authError) {
      return { error: `Gagal membuat akun: ${authError.message}` };
    }

    if (authData.user) {
      // 2. Insert into admin_roles
      const { error: roleError } = await adminSupabase
        .from('admin_roles')
        .insert({
          user_id: authData.user.id,
          email: authData.user.email,
          role: role
        });

      if (roleError) {
        // Rollback user creation if role assignment fails
        await adminSupabase.auth.admin.deleteUser(authData.user.id);
        return { error: `Gagal menyimpan peran: ${roleError.message}` };
      }

      await logAdminAction('CREATE', 'ADMIN', `${email} (${role})`);
      revalidatePath("/admin/pengaturan/admin");
      return { success: true };
    }

    return { error: "Terjadi kesalahan tidak diketahui." };
  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan internal." };
  }
}

export async function deleteAdmin(userId: string, email: string) {
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) {
    return { error: "Unauthorized. Hanya Super Admin yang dapat menghapus admin." };
  }

  try {
    const adminSupabase = getAdminSupabase();
    
    // Check if trying to delete yourself
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === userId) {
      return { error: "Anda tidak dapat menghapus akun Anda sendiri." };
    }

    // Check if it's the last SUPER_ADMIN
    const { data: superAdmins } = await adminSupabase
      .from('admin_roles')
      .select('id')
      .eq('role', 'SUPER_ADMIN');

    const targetUser = await adminSupabase.from('admin_roles').select('role').eq('user_id', userId).single();
    
    if (targetUser.data?.role === 'SUPER_ADMIN' && superAdmins && superAdmins.length <= 1) {
      return { error: "Tidak dapat menghapus Super Admin terakhir di sistem." };
    }

    // Delete user from auth (this will cascade delete admin_roles due to foreign key)
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      return { error: `Gagal menghapus admin: ${deleteError.message}` };
    }

    await logAdminAction('DELETE', 'ADMIN', email);
    revalidatePath("/admin/pengaturan/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan internal." };
  }
}

export async function updateLastSeen() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return { error: "Not logged in" };
  
  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase
    .from('admin_roles')
    .update({ last_seen: new Date().toISOString() })
    .eq('user_id', session.user.id);
    
  if (error) {
    console.error("Error updating last_seen:", error);
    return { error: error.message };
  }
  
  return { success: true };
}
