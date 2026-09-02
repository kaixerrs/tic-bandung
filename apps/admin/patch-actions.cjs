const fs = require("fs");
let p = "src/app/actions/cmsActions.ts";
let c = fs.readFileSync(p, "utf8");

// Hero Slider
c = c.replace(/subtitle: formData\.get\('subtitle'\),/g, "subtitle: formData.get('subtitle'),\n    title_en: formData.get('title_en'),\n    subtitle_en: formData.get('subtitle_en'),");
// News Articles
c = c.replace(/content: formData\.get\('content'\),/g, "content: formData.get('content'),\n    title_en: formData.get('title_en'),\n    content_en: formData.get('content_en'),");
// Galleries
c = c.replace(/image_url: formData\.get\('image_url'\)/g, "image_url: formData.get('image_url'),\n    title_en: formData.get('title_en'),\n    description_en: formData.get('description_en')");
// Destinations
c = c.replace(/content: formData\.get\('content'\),/g, "content: formData.get('content'),\n    name_en: formData.get('name_en'),\n    description_en: formData.get('description_en'),\n    price_info_en: formData.get('price_info_en'),\n    content_en: formData.get('content_en'),");
// Events
c = c.replace(/location_name: formData\.get\('location_name'\),/g, "location_name: formData.get('location_name'),\n    title_en: formData.get('title_en'),\n    description_en: formData.get('description_en'),\n    location_name_en: formData.get('location_name_en'),");
// Categories (if any)
c = c.replace(/description: formData\.get\('description'\),/g, "description: formData.get('description'),\n    name_en: formData.get('name_en'),\n    description_en: formData.get('description_en'),");

fs.writeFileSync(p, c, "utf8");
console.log("Actions patched");
