"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { checkIsSuperAdmin } from "./admin";
import { revalidatePath } from "next/cache";

export async function logAdminAction(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: string,
  entity_name: string
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Allow anonymous admin actions fallback for dev if needed
    const admin_email = user?.email || "admin@ticbandung.com";
    
    let admin_name = null;
    let admin_avatar = null;

    if (user?.id) {
      // Use service role key to bypass RLS for fetching admin profile
      const adminSupabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: roleData } = await adminSupabase
        .from('admin_roles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();
        
      if (roleData) {
        admin_name = roleData.display_name;
        admin_avatar = roleData.avatar_url;
      }
    }

    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_email,
        admin_name,
        admin_avatar,
        action,
        entity,
        entity_name
      });

    if (error) {
      console.error("Failed to insert admin log:", error);
    }
  } catch (err) {
    console.error("Error in logAdminAction:", err);
  }
}

export async function getAdminLogs(page = 1, limit = 20) {
  const supabase = await createClient();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await supabase
    .from('admin_logs')
    .select('*', { count: 'exact' })
    .neq('entity', 'ADMIN')
    .order('created_at', { ascending: false })
    .range(from, to);
    
  return { data, error, count };
}

export async function clearAdminLogs() {
  const supabase = await createClient();
  
  // Verify super admin before deleting
  const isSuperAdmin = await checkIsSuperAdmin();
  if (!isSuperAdmin) {
    return { error: 'Unauthorized: Only Super Admin can clear logs' };
  }
  
  // Note: we can't easily TRUNCATE or DELETE without matching a condition in PostgREST unless we pass an eq.
  // Actually, delete() without eq() throws an error in supabase-js to prevent accidental deletion of everything.
  // We can pass a filter that matches all, like .neq('id', '00000000-0000-0000-0000-000000000000') or similar.
  const { error } = await supabase.from('admin_logs').delete().not('id', 'is', null);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/log');
  return { success: true };
}
