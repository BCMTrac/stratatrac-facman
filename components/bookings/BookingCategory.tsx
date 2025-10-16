'use client';

import { useState } from 'react';
import { Booking } from '@/lib/types';
import { BookingCard } from './BookingCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BookingCategoryProps {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  bookings: Booking[];
}

const categoryGradients: Record<string, string> = {
  recreation: 'from-purple-500 to-purple-700',
  sports: 'from-blue-500 to-blue-700',
  gym: 'from-orange-500 to-orange-700',
  restaurant: 'from-pink-500 to-pink-700',
  maintenance: 'from-red-500 to-red-700',
  moveinout: 'from-stone-500 to-stone-700',
  concierge: 'from-indigo-500 to-indigo-700',
};

export function BookingCategory({
  categoryId,
  categoryName,
  categoryIcon,
  bookings,
}: BookingCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const gradient = categoryGradients[categoryId] || 'from-slate-500 to-slate-700';

  return (
    <div className="mb-4 border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-all`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{categoryIcon}</span>
            <span className="font-semibold text-lg">{categoryName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}