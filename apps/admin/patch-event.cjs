const fs = require("fs");
let p = "src/components/admin/EventForm.tsx";
let c = fs.readFileSync(p, "utf8");

// Title
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">\s*Nama Event\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*type="text"\s*name="title"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Event (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"`);

c = c.replace(/placeholder="Masukkan nama event..."\s*required\s*\/>\s*<\/div>/, 
`placeholder="Masukkan nama event..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Event (English)
              </label>
              <input
                type="text"
                name="title_en"
                defaultValue={initialData?.title_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all"
                placeholder="Enter event name in English..."
              />
            </div>
          </div>`);

// Location name
c = c.replace(/<div className="space-y-2">\s*<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">\s*Nama Lokasi\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<input\s*type="text"\s*name="location_name"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Lokasi (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location_name"`);

c = c.replace(/placeholder="Misal: Kiara Artha Park"\s*required\s*\/>\s*<\/div>/, 
`placeholder="Misal: Kiara Artha Park"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Nama Lokasi (English)
              </label>
              <input
                type="text"
                name="location_name_en"
                defaultValue={initialData?.location_name_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all"
                placeholder="e.g., Kiara Artha Park"
              />
            </div>
          </div>`);

// Description
c = c.replace(/<div className="space-y-2 md:col-span-2">\s*<label className="text-sm font-semibold text-gray-700">\s*Deskripsi Event\s*<span className="text-red-500">\*<\/span>\s*<\/label>\s*<textarea\s*name="description"/, 
`<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Deskripsi Event (Indonesia)
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"`);

c = c.replace(/placeholder="Deskripsi singkat event..."\s*required\s*\/>\s*<\/div>/, 
`placeholder="Deskripsi singkat event..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Deskripsi Event (English)
              </label>
              <textarea
                name="description_en"
                rows={4}
                defaultValue={initialData?.description_en || ''}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D7A5E] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Event description in English..."
              />
            </div>
          </div>`);

fs.writeFileSync(p, c, "utf8");
console.log("Event patched");
