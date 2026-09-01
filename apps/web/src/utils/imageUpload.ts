import { createClient } from '@/utils/supabase/client';

/**
 * Compresses an image File to WebP format using HTML Canvas
 * @param file The original image File
 * @param maxWidth The maximum width for the image (aspect ratio is maintained)
 * @param quality Compression quality (0 to 1)
 * @returns A promise that resolves to a new File object in WebP format
 */
export function compressImageToWebp(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert blob to File
              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const newFile = new File([blob], newFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Uploads a file to Supabase Storage 'uploads' bucket
 * @param file The file to upload
 * @param folder Optional subfolder inside the bucket (e.g. 'hero', 'news', 'gallery')
 * @returns The public URL of the uploaded image
 */
export async function uploadToSupabase(file: File, folder = 'general'): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl;
}
