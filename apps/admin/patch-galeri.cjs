const fs = require("fs");
let p = "src/components/admin/cms/GaleriClient.tsx";
let c = fs.readFileSync(p, "utf8");

// Type definition
c = c.replace(/title: string \| null;\n  category: string;/, "title: string | null;\n  title_en?: string;\n  description_en?: string;\n  category: string;");

// Form fields
c = c.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto \(Opsional\)<\/label>\s*<input \s*name="title" \s*type="text" \s*defaultValue=\{initialData\?.title \|\| ''\}\s*className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-\[#3D7A5E\] outline-none transition-colors"\s*placeholder="Contoh: Suasana Malam Braga"\s*\/>\s*<\/div>/, 
`<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto (Indonesia)</label>
              <input 
                name="title" 
                type="text" 
                defaultValue={initialData?.title || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Contoh: Suasana Malam Braga"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto (English)</label>
              <input 
                name="title_en" 
                type="text" 
                defaultValue={initialData?.title_en || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Example: Night at Braga"
              />
            </div>`);

fs.writeFileSync(p, c, "utf8");
console.log("Galeri patched");
