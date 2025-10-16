'use client';

import { Booking } from '@/lib/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { format } from 'date-fns';
import { Calendar, Clock, User, MapPin, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BookingDetailsModal } from './BookingDetailsModal';
import { toast } from 'sonner';

interface BookingCardProps {
  booking: Booking;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  'in-progress': 'bg-blue-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
  rejected: 'bg-red-700'
};

export function BookingCard({ booking }: BookingCardProps) {
  const { currentUser, updateBookingStatus, sendNotification, addAuditLog } = useAppStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dateObj = new Date(booking.date);
  const formattedDate = format(dateObj, 'EEE, MMM d');
  const currentStatus = booking.status || 'pending';
  
  const isBookingOwner = currentUser?.email === booking.createdBy;
  const canCancelBooking = isBookingOwner && (currentStatus === 'confirmed' || currentStatus === 'pending');

  const handleCancelBooking = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the details modal
    
    if (!currentUser || !booking) return;

    // Update status to cancelled
    updateBookingStatus(booking.id, 'cancelled', currentUser.email, 'Booking cancelled by user');
    
    // Audit log
    addAuditLog({
      action: 'booking_cancelled',
      entity: 'booking',
      entityId: booking.id,
      userId: currentUser.email,
      userName: currentUser.name,
      details: `User cancelled booking for ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')}`,
      timestamp: new Date().toISOString()
    });

    // Notify admins
    sendNotification(
      booking.id,
      'email',
      'admin@building.com',
      `BOOKING CANCELLED: ${booking.user.name} has cancelled their booking for ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')} at ${booking.time}. Booking ID: ${booking.id}`,
      'booking_cancelled_admin_notification'
    );

    // Notify user
    sendNotification(
      booking.id,
      'email',
      booking.user.email || booking.createdBy,
      `Your booking for ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')} at ${booking.time} has been cancelled. Booking ID: ${booking.id}`,
      'booking_cancelled_user_confirmation'
    );

    toast.success('Booking cancelled successfully', {
      description: 'Admins have been notified of the cancellation'
    });
  };

  return (
    <>
      <BookingDetailsModal 
        booking={booking}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
      
      <div 
        className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setDetailsOpen(true)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground text-lg">
                {booking.facility}
              </h4>
              <Badge className={`${statusColors[currentStatus]} text-white text-xs`}>
                {currentStatus}
              </Badge>
              {canCancelBooking && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-6 px-2 text-xs gap-1"
                  onClick={handleCancelBooking}
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Purpose:</strong> {booking.purpose}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <Clock className="h-3 w-3" />
              {booking.time}
              {booking.duration && (
                <span className="ml-1">({booking.duration})</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span><strong>Unit:</strong> {booking.user.unit}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span><strong>ID:</strong> {booking.id}</span>
            </div>
          </div>
          <div className="text-muted-foreground italic text-xs">
            Booked by: {booking.user.name}
          </div>
        </div>
        
        {booking.notifications && booking.notifications.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              📧 {booking.notifications.filter(n => n.type === 'email').length} emails • 
              💬 {booking.notifications.filter(n => n.type === 'sms').length} SMS sent
            </p>
          </div>
        )}
      </div>
    </>
  );
}
