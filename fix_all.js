const fs = require('fs');
const path1 = 'apps/web/src/app/actions/eventSubmission.ts';

// 1. Fix UTF-16 encoding
let content1;
try {
  // If it's UTF-16LE (because of PowerShell >)
  content1 = fs.readFileSync(path1, 'utf16le');
  if (content1.includes('')) {
    // maybe it wasn't utf16le or it was mixed. Let's try reading as utf8 first.
    let tryUtf8 = fs.readFileSync(path1, 'utf8');
    if (tryUtf8.charCodeAt(0) === 0xFFFD || tryUtf8.includes('\0')) {
      content1 = fs.readFileSync(path1, 'utf16le');
    } else {
      content1 = tryUtf8;
    }
  } else if (!content1.includes('import')) {
     content1 = fs.readFileSync(path1, 'utf8');
  }
} catch (e) {
  content1 = fs.readFileSync(path1, 'utf8');
}

// 2. We need a clean version of updateSubmissionStatusAction
// Let's just completely replace the updateSubmissionStatusAction function
const newUpdateAction = `export async function updateSubmissionStatusAction(id: string, status: "APPROVED" | "REJECTED") {
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
}`;

const functionRegex = /export async function updateSubmissionStatusAction[\s\S]*?revalidatePath\("\/event"\);\s*return \{ success: true, status \};\s*\}/;

if (functionRegex.test(content1)) {
  content1 = content1.replace(functionRegex, newUpdateAction);
  fs.writeFileSync(path1, content1, 'utf8');
  console.log("updateSubmissionStatusAction replaced successfully in eventSubmission.ts");
} else {
  console.log("Could not find updateSubmissionStatusAction in eventSubmission.ts");
  // Let's just output the file to see why
  console.log("File starts with:", content1.substring(0, 100));
}

// 3. Fix missing import `dynamic` in EventSubmissionForm.tsx
const path2 = 'apps/web/src/components/public/EventSubmissionForm.tsx';
if (fs.existsSync(path2)) {
  let content2 = fs.readFileSync(path2, 'utf8');
  if (!content2.includes("import dynamic from 'next/dynamic'")) {
    content2 = "import dynamic from 'next/dynamic';\n" + content2;
    fs.writeFileSync(path2, content2, 'utf8');
    console.log("Added missing dynamic import in EventSubmissionForm.tsx");
  }
}

