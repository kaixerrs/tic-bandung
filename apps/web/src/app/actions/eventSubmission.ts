"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function submitEventFormAction(formData: FormData) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const title = formData.get("title") as string;
    const start_date_str = formData.get("start_date") as string;
    const start_time_str = formData.get("start_time") as string;
    const end_date_str = formData.get("end_date") as string;
    const end_time_str = formData.get("end_time") as string;
    const timezone = formData.get("timezone") as string;
    
    // Combine Date and Time
    const start_date = (start_date_str && start_time_str) ? new Date(`${start_date_str}T${start_time_str}:00`).toISOString() : null;
    const end_date = (end_date_str && end_time_str) ? new Date(`${end_date_str}T${end_time_str}:00`).toISOString() : null;

    const has_registration = formData.get("has_registration") === "true";
    
    const eo_name = formData.get("eo_name") as string;
    const location = formData.get("location") as string;
    const event_type = formData.get("event_type") as string;
    const description = formData.get("description") as string;
    const pic_name = formData.get("pic_name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const instagram = formData.get("instagram") as string;
    const additional_info_link = formData.get("additional_info_link") as string;
    const payment_type = formData.get("payment_type") as string;
    const event_scale = formData.get("event_scale") as string;
    const event_category = formData.get("event_category") as string;
    const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
    const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
    const country = formData.get("country") as string;
    const province = formData.get("province") as string;
    const city = formData.get("city") as string;
    const district = formData.get("district") as string;
    const village = formData.get("village") as string;
    
    const ticketLinksRaw = formData.get("ticket_links") as string;
    const ticket_links = ticketLinksRaw ? JSON.parse(ticketLinksRaw) : [];

    const kol_partner = formData.get("kol_partner") as string;
    const artist_performance = formData.get("artist_performance") as string;
    const usp = formData.get("usp") as string;
    const target_visitors = formData.get("target_visitors") ? parseInt(formData.get("target_visitors") as string) : null;
    const execution_count = formData.get("execution_count") ? parseInt(formData.get("execution_count") as string) : null;
    const promotion_media = formData.get("promotion_media") as string;
    const attachment_link = formData.get("attachment_link") as string;

    // File Uploads
    const uploadFile = async (file: File | null, prefix: string): Promise<string> => {
      if (!file || file.size === 0) return "";
      const fileExt = file.name.split('.').pop();
      const fileName = `${prefix}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('event_submissions').upload(fileName, file);
      if (error) { console.error(`Upload error (${prefix}):`, error); return ""; }
      const { data } = supabase.storage.from('event_submissions').getPublicUrl(fileName);
      return data.publicUrl;
    };

    // 1. Commitment Letter Promise
    const commitmentFile = formData.get("commitment_letter_file") as File;
    const commitmentPromise = (commitmentFile && commitmentFile.size > 0)
      ? uploadFile(commitmentFile, "surat_kesediaan")
      : Promise.resolve((formData.get("commitment_letter_link") as string) || "");

    // 2. Thumbnail Promise
    const thumbnailPromise = uploadFile(formData.get("thumbnail_file") as File, "thumbnail");

    // 3. Gallery Promises
    const galleryCount = parseInt((formData.get("gallery_count") as string) || "0");
    const galleryPromises = [];
    for (let i = 0; i < galleryCount; i++) {
      galleryPromises.push(uploadFile(formData.get(`gallery_file_${i}`) as File, `gallery_${i}`));
    }

    // 4. Sponsor Promises
    const sponsorsRaw = formData.get("sponsors_data") as string;
    const parsedSponsors = sponsorsRaw ? JSON.parse(sponsorsRaw) : [];
    const sponsorPromises = parsedSponsors.map(async (sponsor: any, i: number) => {
      const url = await uploadFile(formData.get(`sponsor_file_${i}`) as File, `sponsor_${i}`);
      return { name: sponsor.name, logo_url: url };
    });

    // Await all uploads concurrently
    const [
      commitment_letter_link,
      thumbnail_link,
      galleryResults,
      sponsors
    ] = await Promise.all([
      commitmentPromise,
      thumbnailPromise,
      Promise.all(galleryPromises),
      Promise.all(sponsorPromises)
    ]);

    const gallery_links = galleryResults.filter(url => url !== "");

    const { error } = await supabase
      .from("event_submissions")
      .insert({
        title, start_date, end_date, timezone, has_registration, eo_name, location, event_type,
        description, pic_name, whatsapp, email, instagram, additional_info_link, payment_type, ticket_links,
        kol_partner, artist_performance, usp, target_visitors, execution_count, promotion_media,
        attachment_link, commitment_letter_link, thumbnail_link, gallery_links, sponsors,
        event_scale, event_category, latitude, longitude, country, province, city, district, village,
        status: "PENDING"
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: "Gagal mengirim formulir. Silakan coba lagi." };
    }

    revalidatePath('/admin/event-submissions');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Submit error:", error);
    return { error: "Terjadi kesalahan internal sistem." };
  }
}

export async function updateSubmissionStatusAction(id: string, status: "APPROVED" | "REJECTED") {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  if (status === "APPROVED") {
    const { data: submission } = await supabase
      .from("event_submissions")
      .select("*")
      .eq("id", id)
      .single();
      
    if (submission) {
      const slug = submission.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const imagesArray = [];
      if (submission.thumbnail_link) imagesArray.push(submission.thumbnail_link);
      if (submission.gallery_links && Array.isArray(submission.gallery_links)) {
        imagesArray.push(...submission.gallery_links);
      }
      
      const { error: insertError } = await supabase
        .from("events")
        .insert({
          title: submission.title,
          slug: slug,
          description: submission.description,
          start_date: submission.start_date,
          end_date: submission.end_date,
          organizer: submission.eo_name,
          event_type: submission.event_type,
          location: submission.location,
          pic_name: submission.pic_name,
          whatsapp: submission.whatsapp,
          email: submission.email,
          instagram: submission.instagram,
          kol_partner: submission.kol_partner,
          artist_performance: submission.artist_performance,
          usp: submission.usp,
          target_visitors: submission.target_visitors,
          execution_count: submission.execution_count,
          promotion_media: submission.promotion_media,
          attachment_link: submission.attachment_link,
          commitment_letter_link: submission.commitment_letter_link,
          status: "published",
          images: imagesArray
        });
        
      if (insertError) {
        console.error("Failed to copy to events:", insertError);
      }
    }
  } else if (status === "REJECTED") {
    const { data: oldSub } = await supabase
      .from("event_submissions")
      .select("title, status")
      .eq("id", id)
      .single();
      
    if (oldSub?.status === "APPROVED") {
      const slug = oldSub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("slug", slug);
        
      if (deleteError) {
        console.error("Failed to remove from events on rejection:", deleteError);
      }
    }
  }

  const { error } = await supabase
    .from("event_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/event-submissions");
  revalidatePath("/admin/event");
  revalidatePath("/event");
  return { success: true, status };
}


export async function deleteSubmissionAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminSupabase
    .from("event_submissions")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Delete Error:", error);
    return { error: "Gagal menghapus data." };
  }

  revalidatePath('/admin/event-submissions');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
