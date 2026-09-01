"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const cluster = formData.get("cluster") as string;
    const cluster_color = formData.get("cluster_color") as string;
    const pillar = formData.get("pillar") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string | null;

    if (!name || !slug || !cluster || !pillar) {
      return { error: "Name, Slug, and Cluster are required." };
    }

    const { data: existing } = await supabase.from("categories").select("id").eq("slug", slug).single();
    if (existing) {
      return { error: "Kategori dengan slug ini sudah ada." };
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        cluster,
        cluster_color,
        pillar,
        description,
        image_url
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "CREATE",
      entity_type: "categories",
      entity_id: data.id,
      details: `Created category: ${name}`
    });

    revalidatePath("/admin/kategori");
    revalidatePath("/kategori");
    return { success: true };
  } catch (error: any) {
    console.error("Create category error:", error);
    return { error: error.message || "Failed to create category" };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const payload: any = {};
    const name = formData.get("name") as string;
    if (name) payload.name = name;
    
    const slug = formData.get("slug") as string;
    if (slug) payload.slug = slug;
    
    const cluster = formData.get("cluster") as string;
    if (cluster) payload.cluster = cluster;
    
    const pillar = formData.get("pillar") as string;
    if (pillar) payload.pillar = pillar;
    
    const cluster_color = formData.get("cluster_color") as string;
    if (cluster_color) payload.cluster_color = cluster_color;
    
    const description = formData.get("description") as string;
    if (description !== null) payload.description = description;

    const image_url = formData.get("image_url") as string | null;
    if (image_url) {
      payload.image_url = image_url;
    }

    const { error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "UPDATE",
      entity_type: "categories",
      entity_id: id,
      details: "Updated category"
    });

    revalidatePath("/admin/kategori");
    revalidatePath("/kategori");
    return { success: true };
  } catch (error: any) {
    console.error("Update category error:", error);
    return { error: error.message || "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Check if any destination is using this category
    const { count: destCount } = await supabase
      .from("destinations")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);
      
    if (destCount && destCount > 0) {
      return { error: `Gagal: Kategori ini masih digunakan oleh ${destCount} destinasi. Hapus atau pindahkan destinasi terlebih dahulu.` };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "23503") {
         return { error: "Gagal: Kategori ini masih memiliki referensi di tabel lain." };
      }
      throw error;
    }

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "DELETE",
      entity_type: "categories",
      entity_id: id,
      details: "Deleted category"
    });

    revalidatePath("/admin/kategori");
    revalidatePath("/kategori");
    return { success: true };
  } catch (error: any) {
    console.error("Delete category error:", error);
    return { error: error.message || "Failed to delete category" };
  }
}

