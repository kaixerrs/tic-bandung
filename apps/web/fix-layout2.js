const fs = require('fs');
const file = 'src/app/[locale]/layout.tsx';
let c = fs.readFileSync(file, 'utf8');

const target1 = `export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">`;

const replacement1 = `import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming ` + '`locale`' + ` is valid
  if (!['id', 'en'].includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">`;

const target2 = `      <body
        className="\\${hankenGrotesk.variable} \\${spaceGrotesk.variable} \\${outfit.variable} \\${outfit.className} bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen"
      >
        {children}
        <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
      </body>`;

const replacement2 = `      <body
        className="\\${hankenGrotesk.variable} \\${spaceGrotesk.variable} \\${outfit.variable} \\${outfit.className} bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen"
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
        </NextIntlClientProvider>
      </body>`;

// Re-write everything cleanly
const newLayout = `import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken-grotesk" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "TIC Kota Bandung",
  description: "Portal wisata resmi Dinas Pariwisata Kota Bandung",
  icons: {
    icon: '/icon.png',
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
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!['id', 'en'].includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={\`\${hankenGrotesk.variable} \${spaceGrotesk.variable} \${outfit.variable} \${outfit.className} bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen\`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' } }} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
`;

fs.writeFileSync(file, newLayout);
console.log('Layout replaced');
