"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    // Basic replacement of the locale prefix in the URL
    if (pathname) {
      const segments = pathname.split('/');
      segments[1] = newLocale;
      router.push(segments.join('/') || '/');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold">{currentLocale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          <button 
            onClick={() => handleLocaleChange('id')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLocale === 'id' ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'}`}
          >
            🇮🇩 Indonesia
          </button>
          <button 
            onClick={() => handleLocaleChange('en')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLocale === 'en' ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'}`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}
