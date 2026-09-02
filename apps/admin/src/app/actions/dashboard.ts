"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteDestinationAction(id: string) {
  const supabase = await createClient();

  // NFR-12: Ensure admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // First, get the images so we can delete them from storage
  const { data: images } = await supabase
    .from('destination_images')
    .select('image_url')
    .eq('destination_id', id);

  if (images && images.length > 0) {
    const pathsToDelete = images.map(img => {
      // Extract the path from the URL. 
      // Supabase format: https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[path]
      const parts = img.image_url.split('/destination-images/');
      if (parts.length > 1) {
        return parts[1]; // The path after the bucket name
      }
      return null;
    }).filter(Boolean) as string[];

    if (pathsToDelete.length > 0) {
      await supabase.storage.from('destination-images').remove(pathsToDelete);
    }
  }

  // Delete the destination (this will cascade and delete destination_images records)
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Delete Error:", error);
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/kategori');
  revalidatePath('/peta');
  return { success: true };
}

export async function togglePublishStatusAction(id: string, currentStatus: string) {
  const supabase = await createClient();

  // NFR-12: Ensure admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const newStatus = currentStatus === 'published' ? 'draft' : 'published';

  const { error } = await supabase
    .from('destinations')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error("Update Status Error:", error);
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/kategori');
  revalidatePath('/peta');
  return { success: true, newStatus };
}
