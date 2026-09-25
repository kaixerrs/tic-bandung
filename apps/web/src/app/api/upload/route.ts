import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);


// Utility to check magic bytes for security (Priority 8)
async function isValidFile(file: File): Promise<boolean> {
  if (file.size === 0) return true;
  const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const header = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  
  if (header.startsWith('25504446')) return true; // PDF
  if (header.startsWith('FFD8FF')) return true; // JPEG
  if (header === '89504E47') return true; // PNG
  if (header === '52494646') return true; // WEBP/RIFF
  if (header === '504B0304') return true; // DOCX/ZIP
  if (header.startsWith('3C3F786D') || header.startsWith('3C737667')) return true; // SVG (XML or SVG)
  if (header.startsWith('47494638')) return true; // GIF
  
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. SECURITY CHECK: Must be authenticated
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Anda harus login.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isValid = await isValidFile(file);
    if (!isValid) {
      return NextResponse.json({ error: 'Format file tidak valid / magic bytes salah.' }, { status: 400 });
    }

    // 2. SECURITY CHECK: File Size Limit (Max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar. Maksimal 5MB.' }, { status: 400 });
    }

    // 3. SECURITY CHECK: File Type Validation (Images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak diizinkan. Hanya menerima gambar (JPG, PNG, WEBP, GIF, SVG).' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 });
  }
}
