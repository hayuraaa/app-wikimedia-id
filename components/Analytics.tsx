'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Kecil delay supaya document.title sudah terupdate
    const timeout = setTimeout(() => {
      trackPageView(pathname);
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Tidak render apapun — invisible component
  return null;
}