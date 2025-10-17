'use client';

import { useEffect, useState } from 'react';

interface ClientDateProps {
  date: string | Date;
  className?: string;
  format?: 'full' | 'date' | 'time';
}

export function ClientDate({ date, className = '', format = 'full' }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return <span className={className}>Loading...</span>;
  }

  const dateObj = new Date(date);
  
  let formattedDate = '';
  
  switch (format) {
    case 'full':
      formattedDate = dateObj.toLocaleString();
      break;
    case 'date':
      formattedDate = dateObj.toLocaleDateString();
      break;
    case 'time':
      formattedDate = dateObj.toLocaleTimeString();
      break;
    default:
      formattedDate = dateObj.toLocaleString();
  }

  return <span className={className}>{formattedDate}</span>;
}
