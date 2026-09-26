1. Security Headers (middleware.ts) — Prioritas Tertinggi
ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const res = NextResponse.next();

  res.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; ` +
    `style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; ` +
    `font-src 'self'; connect-src 'self' https://*.supabase.co; ` +
    `frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
  );
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.delete("X-Powered-By");
  return res;
}

Di next.config.js, matikan header X-Powered-By bawaan: poweredByHeader: false.

2. Autentikasi & Sesi (CMS Admin)
Auth.js (NextAuth) atau JWT custom — cookie httpOnly + secure + sameSite=strict.
Hash password dengan argon2id (lebih tahan GPU-cracking dari bcrypt), min. cost sesuai OWASP.
Rate limit endpoint login (lihat #5) + account lockout setelah 5x gagal berturut-turut.
2FA (TOTP) wajib untuk role admin/superadmin — ini yang paling sering dilewatkan di CMS internal kecil.
Session timeout pendek untuk admin (mis. 30–60 menit idle) + rotasi token saat privilege berubah.
3. Otorisasi / RBAC — Jangan Percaya Client
Setiap API route & Server Action yang menyentuh data CMS wajib re-check role di server, terlepas dari apa yang UI tampilkan.
Buat helper terpusat requireRole(session, ["admin"]) dipanggil di awal tiap handler — jangan duplikasi logic cek role di banyak tempat (DRY).
4. Validasi & Sanitasi Input
ts
// contoh: validasi Server Action dengan Zod
const CreateArticleSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().max(50_000),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});
Sanitasi HTML dari rich-text editor CMS pakai DOMPurify di server (bukan cuma di client) sebelum disimpan ke DB — mencegah stored XSS yang tampil ke semua pengunjung web.
Prisma: selalu pakai query builder-nya, jangan $queryRawUnsafe dengan string concat dari input user.
5. Rate Limiting & API Hardening
ts
// contoh dengan @upstash/ratelimit + Redis
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 request/menit per IP untuk login
});
Terapkan minimal di: /api/login, form kontak publik, endpoint upload media.
Response error di production tidak boleh bocorkan stack trace / nama library.
Untuk mutating request (POST/PUT/DELETE), verifikasi header Origin/Referer sebagai lapisan tambahan anti-CSRF.
6. Secrets & Environment Variables
.env.local di .gitignore, jangan pernah commit.
Audit ulang: prefix NEXT_PUBLIC_ hanya untuk variabel yang memang aman terekspos ke browser.
Kalau pakai Supabase: service_role key hanya boleh dipakai di server (Route Handler/Server Action), tidak pernah di bundle client.
Simpan secret production di Vercel Environment Variables (encrypted), rotate berkala.
7. Database Security (Prisma/Supabase)
Enable Row Level Security (RLS) di semua tabel Supabase, default deny, lalu buat policy eksplisit per role. Ini poin yang paling sering lupa saat migrasi dari Prisma-only ke Supabase.
sql
alter table articles enable row level security;
create policy "public read published" on articles
  for select using (status = 'published');
create policy "admin full access" on articles
  for all using (auth.jwt() ->> 'role' = 'admin');
DB role least-privilege — service account CMS tidak perlu akses DROP/ALTER.
Audit log tabel sensitif (siapa ubah apa, kapan).
8. Upload File (Media CMS)
Validasi magic bytes, bukan cuma ekstensi file (ekstensi gampang dipalsukan).
Batasi ukuran & tipe MIME (whitelist: image/jpeg, image/png, image/webp, dll).
Rename file jadi random/UUID, simpan di storage bucket privat + signed URL, jangan langsung serve dari path yang bisa ditebak.
9. Dependency & Supply Chain
Jalankan pnpm audit / aktifkan Dependabot rutin.
Pin versi dependency kritikal, review changelog sebelum upgrade major.
10. Infrastruktur & Deployment
Force HTTPS redirect (biasanya default di Vercel, tapi cek).
Kalau bisa, taruh Cloudflare di depan untuk WAF + DDoS protection.
Pertimbangkan lapisan tambahan khusus untuk /admin — basic auth di edge, atau IP allowlist kalau tim kamu akses dari IP tetap.
11. Logging, Monitoring & Audit Trail
Log semua percobaan login (sukses/gagal) dan aksi admin (create/update/delete konten CMS).
Set alert sederhana (email/webhook) kalau ada lonjakan login gagal dari satu IP.
✅ Checklist Audit Cepat
 CSP + security headers aktif di semua response
 RLS aktif di semua tabel Supabase
 2FA aktif untuk akun admin CMS
 Rate limiting di login & form publik
 Semua input tervalidasi Zod + HTML CMS di-sanitize server-side
 service_role key tidak pernah ada di client bundle
 Upload file divalidasi magic bytes + disimpan di storage privat
 Tidak ada raw SQL string concat dari input user
 npm/pnpm audit bersih dari critical/high vulnerability