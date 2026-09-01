'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function BlurText({ text, delay = 0, className = "" }: BlurTextProps) {
  const words = typeof text === 'string' ? text.split(" ") : [];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    }),
  };

  const child: any = {
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      filter: 'blur(15px)',
      y: 15,
    },
  };

  if (!words.length) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

