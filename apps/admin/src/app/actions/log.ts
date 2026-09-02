"use server";

import { createClient } from "@/utils/supabase/server";
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

    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_email,
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

export async function getAdminLogs() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .neq('entity', 'ADMIN')
    .order('created_at', { ascending: false })
    .limit(100);
    
  return { data, error };
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
