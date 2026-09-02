const fs = require("fs");
let p = "src/components/admin/DestinationForm.tsx";
let c = fs.readFileSync(p, "utf8");

// Name
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">\s*Nama Destinasi\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*type="text"\s*name="name"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Destinasi (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"`);

c = c.replace(/placeholder="Masukkan nama destinasi..."\s*required\s*\/>\s*<\/div>/, 
`placeholder="Masukkan nama destinasi..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Destinasi (English)
              </label>
              <input
                type="text"
                name="name_en"
                defaultValue={initialData?.name_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all"
                placeholder="Enter destination name..."
              />
            </div>
          </div>`);

// Description
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700">\s*Deskripsi Singkat\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<textarea\s*name="description"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Deskripsi Singkat (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"`);

c = c.replace(/placeholder="Deskripsi singkat maksimal 150 karakter..."\s*required\s*\/>\s*<\/div>/, 
`placeholder="Deskripsi singkat maksimal 150 karakter..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Deskripsi Singkat (English)
              </label>
              <textarea
                name="description_en"
                rows={3}
                defaultValue={initialData?.description_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Short description max 150 characters..."
              />
            </div>
          </div>`);

// Price Info
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700">\s*Harga Tiket \/ Info Harga\s*<\/label>\s*<input\s*type="text"\s*name="price_info"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Harga Tiket / Info Harga (Indonesia)
              </label>
              <input
                type="text"
                name="price_info"`);

c = c.replace(/placeholder="Misal: Rp 50.000 \/ Gratis"\s*\/>\s*<\/div>/, 
`placeholder="Misal: Rp 50.000 / Gratis"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Harga Tiket / Info Harga (English)
              </label>
              <input
                type="text"
                name="price_info_en"
                defaultValue={initialData?.price_info_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all"
                placeholder="e.g., IDR 50,000 / Free"
              />
            </div>
          </div>`);

// ContentHtml
c = c.replace(/const \[contentHtml, setContentHtml\] = useState<string>\(initialData\?\.content \|\| ''\);/, 
`const [contentHtml, setContentHtml] = useState<string>(initialData?.content || '');
  const [contentHtmlEn, setContentHtmlEn] = useState<string>(initialData?.content_en || '');`);

c = c.replace(/formData\.append\('content', contentHtml\);/, 
`formData.append('content', contentHtml);
        formData.append('content_en', contentHtmlEn);`);

c = c.replace(/if \(contentHtml.includes\('data:image\/'\)\) \{/, 
`if (contentHtml.includes('data:image/') || contentHtmlEn.includes('data:image/')) {`);

c = c.replace(/<div className="space-y-2 md:col-span-2">\s*<label className="text-sm font-semibold text-gray-700">\s*Konten Lengkap \/ Artikel\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">[\s\S]*?<\/div>\s*<\/div>/, 
(match) => {
  return `<div className="space-y-6 md:col-span-2">
            ${match.replace('Konten Lengkap / Artikel', 'Konten Lengkap (Indonesia)').replace('md:col-span-2', '')}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Konten Lengkap (English)
              </label>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
                <ReactQuillAny
                  theme="snow"
                  value={contentHtmlEn}
                  onChange={setContentHtmlEn}
                  modules={modules}
                  className="h-[300px] pb-12"
                  placeholder="Enter full content in English..."
                />
              </div>
            </div>
          </div>`;
});

fs.writeFileSync(p, c, "utf8");
console.log("Destination patched");
