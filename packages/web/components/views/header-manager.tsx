'use client'

import { usePathname } from "next/navigation";
import React from "react";

export function HeaderManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const hideHeaderPaths = ['/login', '/register', '/signup', '/forgot-password', '/reset-password'];
  
  const shouldHideHeader = hideHeaderPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (shouldHideHeader) {
    return null;
  }

  return <>{children}</>;
}
