'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';

export function DataLoader() {
  const loadBookings = useAppStore(state => state.loadBookings);

  useEffect(() => {
    // Load bookings from persistent storage on mount
    loadBookings();
  }, [loadBookings]);

  return null;
}
