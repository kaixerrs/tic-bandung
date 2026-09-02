const fs = require("fs");
let p = "src/components/admin/cms/HeroSliderClient.tsx";
let c = fs.readFileSync(p, "utf8");

// Type definition
c = c.replace(/title: string;\n  subtitle: string \| null;/, "title: string;\n  subtitle: string | null;\n  title_en?: string;\n  subtitle_en?: string;");

// Form fields
c = c.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama<\/label>\s*<input \s*name="title" \s*type="text" \s*required \s*defaultValue=\{initialData\?.title \|\| ''\}\s*className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-\[#3D7A5E\] outline-none transition-colors"\s*placeholder="Contoh: Gedung Sate"\s*\/>\s*<\/div>/, 
`<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama (Indonesia)</label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={initialData?.title || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Contoh: Gedung Sate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Utama (English)</label>
              <input 
                name="title_en" 
                type="text" 
                defaultValue={initialData?.title_en || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors"
                placeholder="Example: Gedung Sate"
              />
            </div>`);

c = c.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Subjudul \(Deskripsi Singkat\)<\/label>\s*<textarea \s*name="subtitle" \s*rows=\{3\}\s*defaultValue=\{initialData\?.subtitle \|\| ''\}\s*className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-\[#3D7A5E\] outline-none transition-colors resize-none"\s*placeholder="Contoh: Ikon bersejarah perpaduan arsitektur..."\s*\/>\s*<\/div>/, 
`<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul / Deskripsi Singkat (Indonesia)</label>
              <textarea 
                name="subtitle" 
                rows={3}
                defaultValue={initialData?.subtitle || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors resize-none"
                placeholder="Contoh: Ikon bersejarah perpaduan arsitektur..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul / Deskripsi Singkat (English)</label>
              <textarea 
                name="subtitle_en" 
                rows={3}
                defaultValue={initialData?.subtitle_en || ''}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#3D7A5E] outline-none transition-colors resize-none"
                placeholder="Example: Historical icon combining European architecture..."
              />
            </div>`);

fs.writeFileSync(p, c, "utf8");
console.log("Hero patched");
