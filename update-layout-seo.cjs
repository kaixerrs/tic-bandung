const fs = require("fs");
let p = "apps/web/src/app/[locale]/layout.tsx";
let c = fs.readFileSync(p, "utf8");

const oldMeta = `export const metadata: Metadata = {
  title: "TIC Kota Bandung",
  description: "Portal wisata resmi Dinas Pariwisata Kota Bandung",
  icons: {
    icon: '/icon.png',
  }
};`;

const newMeta = `export const metadata: Metadata = {
  metadataBase: new URL('https://ticbandung.com'),
  title: {
    default: "TIC Kota Bandung | Tourist Information Center",
    template: "%s | TIC Kota Bandung"
  },
  description: "Portal wisata resmi Dinas Kebudayaan dan Pariwisata Kota Bandung. Temukan destinasi wisata, kalender event, panduan kuliner, dan informasi transportasi terlengkap di Kota Bandung.",
  keywords: ["Wisata Bandung", "Bandung Tourism", "TIC Bandung", "Destinasi Bandung", "Event Bandung", "Kuliner Bandung", "Pariwisata Bandung"],
  authors: [{ name: "Fayiz apriwansyah nugraha", url: "https://ticbandung.com" }, { name: "Dinas Kebudayaan dan Pariwisata Kota Bandung" }],
  creator: "Fayiz apriwansyah nugraha",
  publisher: "Dinas Kebudayaan dan Pariwisata Kota Bandung",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: "https://ticbandung.com",
    title: "TIC Kota Bandung | Tourist Information Center",
    description: "Portal wisata resmi Dinas Kebudayaan dan Pariwisata Kota Bandung. Temukan destinasi wisata terbaik di Kota Bandung.",
    siteName: "TIC Kota Bandung",
    images: [
      {
        url: "/logo/tic-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TIC Kota Bandung"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TIC Kota Bandung | Tourist Information Center",
    description: "Portal wisata resmi Dinas Kebudayaan dan Pariwisata Kota Bandung.",
    images: ["/logo/tic-og-image.jpg"],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: "https://ticbandung.com",
    languages: {
      'id': 'https://ticbandung.com/id',
      'en': 'https://ticbandung.com/en'
    }
  }
};`;

if (c.includes(oldMeta)) {
  c = c.replace(oldMeta, newMeta);
  fs.writeFileSync(p, c, "utf8");
  console.log("Root metadata updated");
} else {
  console.log("Could not find old metadata in layout.tsx");
}
