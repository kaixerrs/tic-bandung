const fs = require('fs');
const path = 'apps/web/src/app/actions/eventSubmission.ts';
let lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

const brokenIdx = lines.findIndex(l => l.includes('} else if (status === "REJECTED") {'));
if (brokenIdx > -1 && brokenIdx < 100) {
  lines.splice(brokenIdx, 18);
  console.log('Removed broken block');
}

const targetLine = '  const { error } = await supabase';
const correctIdx = lines.findLastIndex(l => l === targetLine);
if (correctIdx > -1) {
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
  
  lines.splice(correctIdx, 0, insertion);
  fs.writeFileSync(path, lines.join('\n'), 'utf8');
  console.log('Successfully injected at correct location.');
} else {
  console.log('Could not find correct insertion point.');
}
