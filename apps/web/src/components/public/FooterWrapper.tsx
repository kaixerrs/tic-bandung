"use client";

import { usePathname } from "next/navigation";

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide footer entirely on the map page to prevent confusing scroll traps on mobile
  if (pathname === '/peta') {
    return null;
  }
  
  return <>{children}</>;
}
