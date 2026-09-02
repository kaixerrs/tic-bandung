const fs = require("fs");
let p = "apps/admin/src/components/admin/cms/HeroSliderClient.tsx";
let c = fs.readFileSync(p, "utf8");

// 1. Add ImageCropperModal import
c = c.replace(
  "import { compressImageToWebp, uploadToSupabase } from '@/utils/imageUpload';",
  "import { compressImageToWebp, uploadToSupabase } from '@/utils/imageUpload';\nimport ImageCropperModal from '@/components/ui/ImageCropperModal';"
);

// 2. Add cropper states after selectedFile state
c = c.replace(
  "const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);",
  "const [selectedFile, setSelectedFile] = useState<File | null>(null);\n  const [originalFile, setOriginalFile] = useState<File | null>(null);\n  const [cropModalOpen, setCropModalOpen] = useState(false);\n  const [cropTargetFile, setCropTargetFile] = useState<File | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);"
);

// 3. Replace handleImageSelect to open cropper instead of directly previewing
c = c.replace(
  `const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File yang dipilih bukan gambar valid.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };`,
  `const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('File yang dipilih bukan gambar valid.');
        return;
      }
      setOriginalFile(file);
      setCropTargetFile(file);
      setCropModalOpen(true);
      setError(null);
      e.target.value = '';
    }
  };

  const handleEditImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalFile) {
      setCropTargetFile(originalFile);
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], cropTargetFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setCropModalOpen(false);
    setCropTargetFile(null);
  };`
);

// 4. Add "Adjust" button overlay when image is previewed AND originalFile exists
c = c.replace(
  `<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Ganti Gambar
                      </span>
                    </div>`,
  `<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-3">
                      <span className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Ganti Gambar
                      </span>
                    </div>
                    {originalFile && (
                      <button
                        type="button"
                        onClick={handleEditImage}
                        className="absolute top-2 right-2 z-10 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Adjust
                      </button>
                    )}`
);

// 5. Add ImageCropperModal component before the closing </div> of the side drawer
c = c.replace(
  `</div>
      </div>
    </div>
  );
}

// Main Page Component`,
  `</div>
      </div>
      <ImageCropperModal
        isOpen={cropModalOpen}
        imageFile={cropTargetFile}
        aspectRatio={16/9}
        onClose={() => { setCropModalOpen(false); setCropTargetFile(null); }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

// Main Page Component`
);

fs.writeFileSync(p, c, "utf8");
console.log("ImageCropperModal added to HeroSliderClient");
