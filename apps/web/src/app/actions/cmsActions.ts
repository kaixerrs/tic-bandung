'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from './log';

// --- HERO SLIDER ACTIONS ---

export async function createHeroSlider(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('hero_sliders').insert([{
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    image_url: formData.get('image_url'),
    button_link: formData.get('button_link'),
    is_active: formData.get('is_active') === 'on'
  }]);
  if (error) return { error: error.message };
  revalidatePath('/admin/hero-slider');
  revalidatePath('/');
  await logAdminAction('CREATE', 'HERO_SLIDER', formData.get('title') as string);
  return { success: true };
}

export async function updateHeroSlider(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('hero_sliders').update({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    image_url: formData.get('image_url'),
    button_link: formData.get('button_link'),
    is_active: formData.get('is_active') === 'on'
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/hero-slider');
  revalidatePath('/');
  await logAdminAction('UPDATE', 'HERO_SLIDER', formData.get('title') as string);
  return { success: true };
}

export async function deleteHeroSlider(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('hero_sliders').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/hero-slider');
  revalidatePath('/');
  await logAdminAction('DELETE', 'HERO_SLIDER', `ID: ${id}`);
  return { success: true };
}

// --- NEWS ARTICLES ACTIONS ---

export async function createNewsArticle(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // Append a random string to avoid duplicate slugs easily
  slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;

  const { error } = await supabase.from('news_articles').insert([{
    title,
    category: formData.get('category'),
    date_published: formData.get('date_published'),
    image_url: formData.get('image_url'),
    color_theme: formData.get('color_theme'),
    content: formData.get('content'),
    slug: slug,
    images: formData.get('images') ? JSON.parse(formData.get('images') as string) : []
  }]);
  if (error) return { error: error.message };
  revalidatePath('/admin/berita');
  revalidatePath('/');
  await logAdminAction('CREATE', 'NEWS', formData.get('title') as string);
  return { success: true };
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;

  const { error } = await supabase.from('news_articles').update({
    title,
    category: formData.get('category'),
    date_published: formData.get('date_published'),
    image_url: formData.get('image_url'),
    color_theme: formData.get('color_theme'),
    content: formData.get('content'),
    images: formData.get('images') ? JSON.parse(formData.get('images') as string) : []
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/berita');
  revalidatePath('/');
  await logAdminAction('UPDATE', 'NEWS', formData.get('title') as string);
  return { success: true };
}

export async function deleteNewsArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('news_articles').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/berita');
  revalidatePath('/');
  await logAdminAction('DELETE', 'NEWS', `ID: ${id}`);
  return { success: true };
}

// --- GALLERIES ACTIONS ---

export async function createGallery(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('galleries').insert([{
    title: formData.get('title'),
    category: formData.get('category'),
    image_url: formData.get('image_url'),
    is_featured: formData.get('is_featured') === 'on'
  }]);
  if (error) return { error: error.message };
  revalidatePath('/admin/galeri');
  revalidatePath('/');
  await logAdminAction('CREATE', 'GALLERY', formData.get('title') as string);
  return { success: true };
}

export async function updateGallery(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('galleries').update({
    title: formData.get('title'),
    category: formData.get('category'),
    image_url: formData.get('image_url'),
    is_featured: formData.get('is_featured') === 'on'
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/galeri');
  revalidatePath('/');
  await logAdminAction('UPDATE', 'GALLERY', formData.get('title') as string);
  return { success: true };
}

export async function deleteGallery(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('galleries').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/galeri');
  revalidatePath('/');
  await logAdminAction('DELETE', 'GALLERY', `ID: ${id}`);
  return { success: true };
}

// --- SITE SETTINGS ---

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
  return data;
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  
  const updates = {
    description: formData.get('description'),
    address: formData.get('address'),
    whatsapp_number: formData.get('whatsapp_number'),
    emergency_police: formData.get('emergency_police'),
    emergency_ambulance: formData.get('emergency_ambulance'),
    emergency_fire: formData.get('emergency_fire'),
    facebook_url: formData.get('facebook_url'),
    instagram_url: formData.get('instagram_url'),
    youtube_url: formData.get('youtube_url'),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', '00000000-0000-0000-0000-000000000001');

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/pengaturan');
  await logAdminAction('UPDATE', 'SETTINGS', 'Pengaturan Website');
  return { success: true };
}

export async function toggleNewsStatus(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const { error } = await supabase.from('news_articles').update({ status: newStatus }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/berita');
  revalidatePath('/');
  await logAdminAction('UPDATE', 'NEWS_STATUS', "ID:  to ");
  return { success: true, newStatus };
}

export async function toggleGalleryStatus(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const { error } = await supabase.from('galleries').update({ status: newStatus }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/galeri');
  revalidatePath('/');
  await logAdminAction('UPDATE', 'GALLERY_STATUS', "ID:  to ");
  return { success: true, newStatus };
}

export async function updateSystemInfo(formData: FormData) {
  const supabase = await createClient();
  
  const cms_version = formData.get('cms_version') as string;
  const cms_status = formData.get('cms_status') as string;
  const maintenance_date = formData.get('maintenance_date') as string;
  const maintenance_time = formData.get('maintenance_time') as string;
  const update_notes = formData.get('update_notes') as string;
  
  // We assume there is only one row in site_settings.
  // First, let's fetch its ID.
  const { data: settings } = await supabase.from('site_settings').select('id').limit(1).single();
  
  let error;
  if (settings) {
    const { error: updateError } = await supabase.from('site_settings').update({
      cms_version,
      cms_status,
      maintenance_date,
      maintenance_time,
      update_notes
    }).eq('id', settings.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from('site_settings').insert([{
      cms_version,
      cms_status,
      maintenance_date,
      maintenance_time,
      update_notes
    }]);
    error = insertError;
  }
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/dashboard');
  await logAdminAction('UPDATE', 'SETTINGS', 'System Information & Maintenance Schedule');
  return { success: true };
}
