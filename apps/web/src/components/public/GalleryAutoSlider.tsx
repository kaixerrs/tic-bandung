"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image_url: string;
}

export default function GalleryAutoSlider({ 
  galleries, 
  locale,
  noGalleryText
}: { 
  galleries: GalleryItem[];
  locale: string;
  noGalleryText: string;
}) {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (!galleries || galleries.length <= 4) return;

    // Rotate every 4 seconds
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % galleries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [galleries]);

  if (!galleries || galleries.length === 0) {
    return <div className="col-span-full text-center py-12 text-gray-500">{noGalleryText}</div>;
  }

  // Get 4 items to display based on startIndex, wrapping around if needed
  const displayItems = [];
  for (let i = 0; i < Math.min(4, galleries.length); i++) {
    const idx = (startIndex + i) % galleries.length;
    displayItems.push(galleries[idx]);
  }

  return (
    <div className="flex md:grid overflow-x-auto md:overflow-hidden snap-x snap-mandatory gap-4 md:gap-6 md:grid-cols-4 md:grid-rows-[auto_auto] md:h-[500px] lg:h-[600px] pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      {displayItems.map((item, i) => {
        let gridClass = 'min-w-[60vw] md:min-w-0 md:col-span-1 h-[250px] md:h-auto snap-start';
        if (i === 0) gridClass = 'min-w-[80vw] md:min-w-0 md:col-span-2 md:row-span-2 h-[250px] md:h-auto snap-start';
        else if (i === 1) gridClass = 'min-w-[70vw] md:min-w-0 md:col-span-2 h-[250px] md:h-auto snap-start';
        
        return (
          <div key={`slot-${i}`} className={`relative overflow-hidden rounded-sm ${gridClass} shadow-sm hover:shadow-electric-yellow transition-all duration-500 bg-slate-100`}>
            <AnimatePresence>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 group cursor-pointer"
              >
                <Image 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  src={item.image_url} 
                  alt={item.title || 'Galeri Bandung'} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-headline-md text-2xl md:text-3xl text-white font-bold tracking-wider mb-2">
                    {locale === 'en' ? (item.title_en || item.title) : item.title}
                  </h3>
                  {item.description && (
                    <p className="text-white/80 font-body-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {locale === 'en' ? (item.description_en || item.description) : item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
