'use client';

import { motion } from 'framer-motion';
import React from 'react';

export function ShinyText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.span
      className={`relative inline-block overflow-hidden ${className}`}
      initial={{ backgroundPosition: '200% 0' }}
      animate={{ backgroundPosition: '-200% 0' }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
        repeatDelay: 1
      }}
      style={{
        backgroundSize: '200% 100%',
        backgroundImage: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 60%, transparent 80%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {text}
    </motion.span>
  );
}
