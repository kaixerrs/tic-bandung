const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Refactor Thumbnail
content = content.replace(
  `onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}`,
  `onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran thumbnail maksimal 2 MB');
      e.target.value = '';
      setThumbnailFile(null);
    } else {
      setThumbnailFile(file || null);
    }
  }}`
);
content = content.replace(`Maks. 5MB`, `Maks. 2MB`);
content = content.replace(`(Maks. 5MB)`, `(Maks. 2MB)`);

// 2. Refactor Gallery
content = content.replace(
  `onChange={(e) => setGalleryFiles(Array.from(e.target.files || []).slice(0, 5))}`,
  `onChange={(e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
    if (files.length > validFiles.length) {
      toast.error('Beberapa gambar diabaikan karena lebih dari 2 MB');
    }
    if (validFiles.length > 5) {
      toast.error('Maksimal 5 gambar diperbolehkan');
    }
    setGalleryFiles(validFiles.slice(0, 5));
    if (validFiles.length === 0) e.target.value = '';
  }}`
);
content = content.replace(`Maks. 10MB per file`, `Maks. 2MB per file`);

// 3. Refactor Sponsor File
content = content.replace(
  `onChange={(e) => handleSponsorFileChange(idx, e.target.files?.[0] || null)}`,
  `onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 1 * 1024 * 1024) {
      toast.error('Ukuran logo sponsor maksimal 1 MB');
      e.target.value = '';
      handleSponsorFileChange(idx, null);
    } else {
      handleSponsorFileChange(idx, file || null);
    }
  }}`
);
content = content.replace(
  `Seret gambar ke sini atau klik untuk upload`,
  `Maks. 1MB per logo`
);

// 4. Refactor Commitment Letter
content = content.replace(
  `name="commitment_letter_file" accept=".pdf,.doc,.docx" required className="`,
  `name="commitment_letter_file" accept=".pdf,.doc,.docx" required onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran surat maksimal 2 MB');
      e.target.value = '';
    }
  }} className="`
);
// Also I remember there was a check `fileInput.files[0].size > 2 * 1024 * 1024` inside step 5 validation, but it didn't block it until you click "Next". Now we do it on change!

fs.writeFileSync(path, content, 'utf8');
console.log("File size limits added and labels updated!");
