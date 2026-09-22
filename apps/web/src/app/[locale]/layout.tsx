import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Grotesk, Outfit } from "next/font/google";
import "../globals.css";
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken-grotesk" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL('https://ticbandung.com'),
  title: {
    default: "Tourist Information Center Kota Bandung",
    template: "%s | TIC Kota Bandung"
  },
  description: "Portal wisata resmi Dinas Kebudayaan dan Pariwisata Kota Bandung. Temukan destinasi wisata, kalender event, panduan kuliner, dan informasi transportasi terlengkap di Kota Bandung.",
  keywords: ["Wisata Bandung", "Bandung Tourism", "TIC Bandung", "Destinasi Bandung", "Event Bandung", "Kuliner Bandung", "Pariwisata Bandung"],
  authors: [{ name: "Fayiz Apriwansyah Nugraha", url: "https://ticbandung.com" }, { name: "Dinas Kebudayaan dan Pariwisata Kota Bandung" }],
  creator: "Fayiz Apriwansyah Nugraha",
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
};

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['id', 'en'].includes(locale)) {
    notFound();
  }
 
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Tourist Information Center Kota Bandung",
              "url": "https://ticbandung.com",
              "description": "Portal wisata resmi Dinas Kebudayaan dan Pariwisata Kota Bandung.",
              "creator": {
                "@type": "Person",
                "name": "Fayiz Apriwansyah Nugraha",
                "jobTitle": "Software Developer"
              },
              "developer": {
                "@type": "Person",
                "name": "Fayiz Apriwansyah Nugraha"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Dinas Kebudayaan dan Pariwisata Kota Bandung"
              }
            })
          }}
        />
      </head>
      <body
        className={`${hankenGrotesk.variable} ${spaceGrotesk.variable} ${outfit.variable} ${outfit.className} bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
        </NextIntlClientProvider>
          <Analytics />
      </body>
    </html>
  );
}
