const fs = require("fs");
let p = "src/components/admin/cms/BeritaForm.tsx";
let c = fs.readFileSync(p, "utf8");

// Add Title (English) input
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">\s*Judul Berita\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*type="text"\s*name="title"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Judul Berita (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"`);

// Find the end of the title input and add the English input
c = c.replace(/placeholder="Masukkan judul berita..."\s*required\s*\/>\s*<\/div>/, 
`placeholder="Masukkan judul berita..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Judul Berita (English)
              </label>
              <input
                type="text"
                name="title_en"
                defaultValue={initialData?.title_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all"
                placeholder="Enter news title in English..."
              />
            </div>
          </div>`);

// Handle contentHtml
// We need to add state for content_en and another ReactQuill
c = c.replace(/const \[contentHtml, setContentHtml\] = useState<string>\(initialData\?\.content \|\| ''\);/, 
`const [contentHtml, setContentHtml] = useState<string>(initialData?.content || '');
  const [contentHtmlEn, setContentHtmlEn] = useState<string>(initialData?.content_en || '');`);

c = c.replace(/formData\.append\('content', contentHtml\);/, 
`formData.append('content', contentHtml);
        formData.append('content_en', contentHtmlEn);`);

c = c.replace(/if \(contentHtml.includes\('data:image\/'\)\) \{/, 
`if (contentHtml.includes('data:image/') || contentHtmlEn.includes('data:image/')) {`);

// Add second ReactQuill editor for English content
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700">\s*Isi Berita\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">[\s\S]*?<\/div>\s*<\/div>/, 
(match) => {
  return `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            ${match.replace('Isi Berita', 'Isi Berita (Indonesia)')}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Isi Berita (English)
              </label>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
                <ReactQuillAny
                  theme="snow"
                  value={contentHtmlEn}
                  onChange={setContentHtmlEn}
                  modules={modules}
                  className="h-\[400px\] pb-12"
                  placeholder="Enter news content in English..."
                />
              </div>
            </div>
          </div>`;
});

fs.writeFileSync(p, c, "utf8");
console.log("Berita patched");
