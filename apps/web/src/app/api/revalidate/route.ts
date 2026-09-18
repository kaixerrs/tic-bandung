import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path, token } = await request.json();

    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    // Menggunakan tipe revalidasi 'layout' untuk memastikan semua variasi route (seperti /[locale]/) ikut terhapus
    revalidatePath(path, 'layout');
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
