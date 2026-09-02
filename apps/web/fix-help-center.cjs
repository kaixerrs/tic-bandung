const fs = require("fs");
let p = "src/app/[locale]/(public)/pusat-bantuan/page.tsx";
let c = fs.readFileSync(p, "utf8");

// We'll just replace the exact text strings with conditionals using locale

c = c.replace(/Layanan Informasi Wisatawan/g, "{locale === 'en' ? 'Tourist Information Services' : 'Layanan Informasi Wisatawan'}");
c = c.replace(/>Pusat Bantuan</g, ">{locale === 'en' ? 'Help Center' : 'Pusat Bantuan'}<");
c = c.replace(/Kami siap memastikan kunjungan Anda di Kota Bandung berjalan aman, nyaman, dan penuh kenangan indah\./g, 
  "{locale === 'en' ? 'We are ready to ensure your visit to Bandung is safe, comfortable, and full of beautiful memories.' : 'Kami siap memastikan kunjungan Anda di Kota Bandung berjalan aman, nyaman, dan penuh kenangan indah.'}");

c = c.replace(/title: 'Polisi'/g, "title: locale === 'en' ? 'Police' : 'Polisi'");
c = c.replace(/description: 'Keamanan & Kriminalitas'/g, "description: locale === 'en' ? 'Security & Criminality' : 'Keamanan & Kriminalitas'");

c = c.replace(/title: 'Ambulans'/g, "title: locale === 'en' ? 'Ambulance' : 'Ambulans'");
c = c.replace(/description: 'Gawat Darurat Medis'/g, "description: locale === 'en' ? 'Medical Emergency' : 'Gawat Darurat Medis'");

c = c.replace(/title: 'Pemadam'/g, "title: locale === 'en' ? 'Firefighter' : 'Pemadam'");
c = c.replace(/description: 'Kebakaran & Penyelamatan'/g, "description: locale === 'en' ? 'Fire & Rescue' : 'Kebakaran & Penyelamatan'");

c = c.replace(/description: 'Layanan Terpadu Bandung'/g, "description: locale === 'en' ? 'Bandung Integrated Services' : 'Layanan Terpadu Bandung'");

c = c.replace(/>Kunjungi Kami</g, ">{locale === 'en' ? 'Visit Us' : 'Kunjungi Kami'}<");
c = c.replace(/>\s*Kantor<br\/>Pelayanan TIC\s*</g, ">{locale === 'en' ? <>TIC Service<br/>Office</> : <>Kantor<br/>Pelayanan TIC</>}<");
c = c.replace(/Datang langsung ke kantor kami! Tim TIC dengan senang hati akan memberikan rekomendasi destinasi, peta wisata gratis, dan panduan acara terkini\./g,
  "{locale === 'en' ? 'Come directly to our office! The TIC team will gladly provide destination recommendations, free tourist maps, and the latest event guides.' : 'Datang langsung ke kantor kami! Tim TIC dengan senang hati akan memberikan rekomendasi destinasi, peta wisata gratis, dan panduan acara terkini.'}");

c = c.replace(/>Alamat Fisik</g, ">{locale === 'en' ? 'Physical Address' : 'Alamat Fisik'}<");
c = c.replace(/>Jam Operasional</g, ">{locale === 'en' ? 'Operational Hours' : 'Jam Operasional'}<");
c = c.replace(/Setiap Hari: 08:00 - 16:00 WIB<br\/>\s*<span className="text-sm text-slate-500">\(Termasuk hari libur nasional\)<\/span>/g,
  "{locale === 'en' ? <>Everyday: 08:00 - 16:00 WIB<br/><span className=\"text-sm text-slate-500\">(Including national holidays)</span></> : <>Setiap Hari: 08:00 - 16:00 WIB<br/><span className=\"text-sm text-slate-500\">(Termasuk hari libur nasional)</span></>}");

c = c.replace(/>\s*Chat WhatsApp\s*<\/a>/g, ">{locale === 'en' ? 'WhatsApp Chat' : 'Chat WhatsApp'}</a>");
c = c.replace(/>\s*Buka di Maps\s*<\/a>/g, ">{locale === 'en' ? 'Open in Maps' : 'Buka di Maps'}</a>");

fs.writeFileSync(p, c, "utf8");
console.log("Help center texts translated");
