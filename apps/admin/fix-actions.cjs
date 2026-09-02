const fs = require("fs");
let p = "src/app/actions/cmsActions.ts";
let c = fs.readFileSync(p, "utf8");

// We'll just reset the file to how it was before my buggy script and then do proper replacements.
// Wait, I'll just remove the duplicate lines using a regex.

// For Hero Slider
c = c.replace(/    title_en: formData\.get\('title_en'\),\n    subtitle_en: formData\.get\('subtitle_en'\),\n    image_url: formData\.get\('image_url'\),\n    title_en: formData\.get\('title_en'\),\n    description_en: formData\.get\('description_en'\),/g, 
"    image_url: formData.get('image_url'),\n    title_en: formData.get('title_en'),\n    subtitle_en: formData.get('subtitle_en'),");

// For News Articles
c = c.replace(/    title_en: formData\.get\('title_en'\),\n    description_en: formData\.get\('description_en'\),\n    color_theme: formData\.get\('color_theme'\),\n    content: formData\.get\('content'\),\n    name_en: formData\.get\('name_en'\),\n    description_en: formData\.get\('description_en'\),\n    price_info_en: formData\.get\('price_info_en'\),\n    content_en: formData\.get\('content_en'\),\n    title_en: formData\.get\('title_en'\),\n    content_en: formData\.get\('content_en'\),/g, 
"    color_theme: formData.get('color_theme'),\n    content: formData.get('content'),\n    title_en: formData.get('title_en'),\n    content_en: formData.get('content_en'),");

fs.writeFileSync(p, c, "utf8");
console.log("Actions fixed");
