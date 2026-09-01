"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "./log";

export async function createEventAction(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Anda harus login sebagai admin." };
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const destination_id = formData.get("destination_id") as string || null;
    const organizer = formData.get("organizer") as string;
    const location = formData.get("location") as string;
    const pic_name = formData.get("pic_name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const instagram = formData.get("instagram") as string;
    const kol_partner = formData.get("kol_partner") as string;
    const artist_performance = formData.get("artist_performance") as string;
    const usp = formData.get("usp") as string;
    const target_visitors = formData.get("target_visitors") ? parseInt(formData.get("target_visitors") as string) : null;
    const execution_count = formData.get("execution_count") ? parseInt(formData.get("execution_count") as string) : null;
    const promotion_media = formData.get("promotion_media") as string;
    const attachment_link = formData.get("attachment_link") as string;
    const commitment_letter_link = formData.get("commitment_letter_link") as string;

    const status = formData.get("status") as string;
    const imageUrl = formData.get("image_url") as string;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const imagesArray = imageUrl ? [imageUrl] : [];

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert({
        title,
        slug,
        description,
        start_date: start_date ? new Date(start_date).toISOString() : null,
        end_date: end_date ? new Date(end_date).toISOString() : null,
        destination_id,
        organizer,
        location,
        pic_name,
        whatsapp,
        email,
        instagram,
        kol_partner,
        artist_performance,
        usp,
        target_visitors,
        execution_count,
        promotion_media,
        attachment_link,
        commitment_letter_link,
        status,
        images: imagesArray
      })
      .select()
      .single();

    if (eventError) {
      console.error(eventError);
      return { error: "Gagal menyimpan data event: " + eventError.message };
    }

    revalidatePath("/admin/event");
    revalidatePath("/event");
    
    await logAdminAction('CREATE', 'EVENT', title);
    return { success: true, id: eventData.id };
  } catch (error: any) {
    console.error(error);
    return { error: "Terjadi kesalahan internal sistem." };
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Anda harus login sebagai admin." };
  }

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const destination_id = formData.get("destination_id") as string || null;
    const organizer = formData.get("organizer") as string;
    const location = formData.get("location") as string;
    const pic_name = formData.get("pic_name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const instagram = formData.get("instagram") as string;
    const kol_partner = formData.get("kol_partner") as string;
    const artist_performance = formData.get("artist_performance") as string;
    const usp = formData.get("usp") as string;
    const target_visitors = formData.get("target_visitors") ? parseInt(formData.get("target_visitors") as string) : null;
    const execution_count = formData.get("execution_count") ? parseInt(formData.get("execution_count") as string) : null;
    const promotion_media = formData.get("promotion_media") as string;
    const attachment_link = formData.get("attachment_link") as string;
    const commitment_letter_link = formData.get("commitment_letter_link") as string;

    const status = formData.get("status") as string;
    const imageUrl = formData.get("image_url") as string;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updatePayload: any = {
      title,
      slug,
      description,
      start_date: start_date ? new Date(start_date).toISOString() : null,
      end_date: end_date ? new Date(end_date).toISOString() : null,
      destination_id,
      organizer,
      location,
      pic_name,
      whatsapp,
      email,
      instagram,
      kol_partner,
      artist_performance,
      usp,
      target_visitors,
      execution_count,
      promotion_media,
      attachment_link,
      commitment_letter_link,
      status,
      updated_at: new Date().toISOString()
    };

    if (imageUrl) {
      updatePayload.images = [imageUrl];
    }

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (eventError) {
      console.error(eventError);
      return { error: "Gagal memperbarui data event: " + eventError.message };
    }

    revalidatePath("/admin/event");
    revalidatePath("/event");

    await logAdminAction('UPDATE', 'EVENT', title);
    return { success: true, id: eventData.id };
  } catch (error: any) {
    console.error(error);
    return { error: "Terjadi kesalahan internal sistem." };
  }
}

export async function deleteEventAction(id: string, title: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Anda harus login sebagai admin." };
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/event");
  revalidatePath("/event");

  await logAdminAction('DELETE', 'EVENT', title);
  return { success: true };
}

export async function toggleEventStatusAction(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';

  const { error } = await supabase
    .from('events')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/event');
  revalidatePath('/event');
  return { success: true, newStatus };
}
