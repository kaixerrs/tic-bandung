'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
