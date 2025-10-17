'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { BookingCategory } from './BookingCategory';
import { Button } from '@/components/ui/button';
export function BookingsList() {
  const { currentUser, bookings, facilities } = useAppStore();

  // Filter bookings based on user role
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let visibleBookings = bookings;

  if (currentUser?.role === 'standard') {
    // Standard users only see their own active bookings
    visibleBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const isUserBooking = booking.createdBy === currentUser.email;
      return isUserBooking && bookingDate >= today;
    });
  } else if (currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser') {
    // Admin users see all active bookings
    visibleBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today;
    });
  }

  // Group bookings by category
  const bookingsByCategory: Record<string, typeof bookings> = {};

  visibleBookings.forEach((booking) => {
    if (!bookingsByCategory[booking.category]) {
      bookingsByCategory[booking.category] = [];
    }
    bookingsByCategory[booking.category].push(booking);
  });

  // Determine title based on role
  const getTitle = () => {
    if (!currentUser) return 'Recent Bookings';
    if (currentUser.role === 'standard') return 'My Active Bookings';
    return 'Active Bookings';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExpandedAll(true);
              // Trigger expand all - we'll implement this better
            }}
          >
            📂 Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExpandedAll(false);
              // Trigger collapse all - we'll implement this better
            }}
          >
            📁 Collapse All
          </Button>
        </div>
      </div>

      {Object.keys(bookingsByCategory).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(bookingsByCategory).map(([categoryId, categoryBookings]) => {
            const categoryInfo = facilities[categoryId];
            if (!categoryInfo) return null;

            return (
              <BookingCategory
                key={categoryId}
                categoryId={categoryId}
                categoryName={categoryInfo.name}
                categoryIcon={categoryInfo.icon}
                bookings={categoryBookings}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}