const fs = require('fs');
const path = 'apps/web/src/app/actions/eventSubmission.ts';
let lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

const idx = lines.findIndex(l => l.includes("const { error } = await supabase"));
if (idx > -1) {
  // It's line 175 (0-indexed 174).
  const insertion = `  } else if (status === "REJECTED") {
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
  }`;
  
  lines.splice(idx, 0, insertion);
  fs.writeFileSync(path, lines.join('\n'), 'utf8');
  console.log("Successfully injected rejection logic.");
} else {
  console.log("Could not find insertion point.");
}
