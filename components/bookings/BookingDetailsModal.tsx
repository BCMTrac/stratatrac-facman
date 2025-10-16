'use client';

import { useState } from 'react';
import { Booking, BookingStatus } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store/useAppStore';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Mail,
  MessageSquare,
  History,
  Bell,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Approval', color: 'bg-yellow-500', icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'bg-green-500', icon: CheckCircle2 },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  completed: { label: 'Completed', color: 'bg-gray-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
  rejected: { label: 'Rejected', color: 'bg-red-700', icon: XCircle }
};

export function BookingDetailsModal({ booking, open, onClose }: BookingDetailsModalProps) {
  const { currentUser, updateBookingStatus, sendNotification, addAuditLog } = useAppStore();
  const [newStatus, setNewStatus] = useState<BookingStatus>('confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [notificationType, setNotificationType] = useState<'email' | 'sms'>('email');
  const [notificationMessage, setNotificationMessage] = useState('');

  if (!booking) return null;

  const isAdmin = currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser';
  const isBookingOwner = currentUser?.email === booking.createdBy;
  const canCancelBooking = isBookingOwner && (booking.status === 'confirmed' || booking.status === 'pending');
  const dateObj = new Date(booking.date);
  const StatusIcon = statusConfig[booking.status || 'confirmed'].icon;

  const handleCancelBooking = () => {
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

    // Notify admins via email
    sendNotification(
      booking.id,
      'email',
      'admin@building.com', // In real app, get all admin emails
      `BOOKING CANCELLED: ${booking.user.name} has cancelled their booking for ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')} at ${booking.time}. Booking ID: ${booking.id}`,
      'booking_cancelled_admin_notification'
    );

    // Notify user via email
    sendNotification(
      booking.id,
      'email',
      booking.user.email || booking.createdBy,
      `Your booking for ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')} at ${booking.time} has been cancelled. Booking ID: ${booking.id}`,
      'booking_cancelled_user_confirmation'
    );

    // Notify user via SMS
    sendNotification(
      booking.id,
      'sms',
      booking.user.email || booking.createdBy,
      `Booking cancelled: ${booking.facility} on ${format(dateObj, 'MMM d, yyyy')} at ${booking.time}`,
      'booking_cancelled_user_confirmation'
    );

    toast.success('Booking cancelled successfully', {
      description: 'Admins have been notified of the cancellation'
    });
  };

  const handleStatusUpdate = () => {
    if (!currentUser || !booking) return;

    updateBookingStatus(booking.id, newStatus, currentUser.email, statusNote);
    
    // Auto-send notification on status change
    const statusMessages: Record<BookingStatus, string> = {
      pending: `Your booking ${booking.id} is pending approval.`,
      confirmed: `Your booking ${booking.id} for ${booking.facility} has been confirmed!`,
      'in-progress': `Your booking ${booking.id} is now in progress.`,
      completed: `Your booking ${booking.id} has been completed. Thank you!`,
      cancelled: `Your booking ${booking.id} has been cancelled.`,
      rejected: `Your booking ${booking.id} has been rejected. ${statusNote || ''}`
    };

    sendNotification(
      booking.id,
      'email',
      booking.user.email || booking.createdBy,
      statusMessages[newStatus],
      `status_changed_to_${newStatus}`
    );

    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
    setStatusNote('');
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim() || !booking) {
      toast.error('Please enter a message');
      return;
    }

    sendNotification(
      booking.id,
      notificationType,
      booking.user.email || booking.createdBy,
      notificationMessage,
      'manual_notification'
    );

    toast.success(`${notificationType.toUpperCase()} notification sent!`);
    setNotificationMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            📋 Booking Details
            <Badge 
              className={`${statusConfig[booking.status || 'confirmed'].color} text-white ml-2`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[booking.status || 'confirmed'].label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Cancel button for booking owner */}
            {canCancelBooking && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Cancel This Booking
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      If you need to cancel this booking, click the button below. Admins will be notified immediately.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleCancelBooking}
                    className="ml-4"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                </div>
              </div>
            )}

            {/* Show status if cancelled or completed */}
            {(booking.status === 'cancelled' || booking.status === 'completed') && (
              <div className={`rounded-lg p-4 ${
                booking.status === 'cancelled' 
                  ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                  : 'bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'
              }`}>
                <p className="text-sm font-medium ${
                  booking.status === 'cancelled' 
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-gray-900 dark:text-gray-100'
                }">
                  {booking.status === 'cancelled' 
                    ? '🚫 This booking has been cancelled'
                    : '✅ This booking has been completed'
                  }
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Booking ID</Label>
                  <p className="text-lg font-semibold">{booking.id}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Facility</Label>
                  <p className="text-lg font-semibold">{booking.facility}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date & Time
                  </Label>
                  <p className="text-lg">{format(dateObj, 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {booking.time}
                    {booking.duration && (
                      <span className="text-muted-foreground">({booking.duration})</span>
                    )}
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Purpose</Label>
                  <p className="text-base">{booking.purpose}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Resident Information
                  </Label>
                  <p className="text-lg font-semibold">{booking.user.name}</p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Unit {booking.user.unit}
                  </p>
                  {booking.user.email && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {booking.user.email}
                    </p>
                  )}
                  {booking.user.phone && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {booking.user.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Created By</Label>
                  <p className="text-sm">{booking.createdBy}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Status Management Tab */}
          <TabsContent value="status" className="space-y-6">
            {isAdmin ? (
              <>
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Update Booking Status
                  </h4>

                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as BookingStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status Note (Optional)</Label>
                    <Textarea
                      placeholder="Add a note about this status change..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleStatusUpdate} className="w-full">
                    Update Status & Notify User
                  </Button>
                </div>

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Send Manual Notification
                  </h4>

                  <div className="space-y-2">
                    <Label>Notification Type</Label>
                    <Select value={notificationType} onValueChange={(v) => setNotificationType(v as 'email' | 'sms')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <span className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </span>
                        </SelectItem>
                        <SelectItem value="sms">
                          <span className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            SMS
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Enter your message..."
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSendNotification} variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Send {notificationType.toUpperCase()}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Status management is only available to administrators</p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Status History
            </h4>

            {booking.statusHistory && booking.statusHistory.length > 0 ? (
              <div className="space-y-3">
                {booking.statusHistory.map((entry, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <Badge className={`${statusConfig[entry.status].color} text-white`}>
                        {statusConfig[entry.status].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Updated by: {entry.updatedBy}
                    </p>
                    {entry.note && (
                      <p className="text-sm mt-2 bg-muted p-2 rounded">{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No status history available</p>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Communication Log
            </h4>

            {booking.notifications && booking.notifications.length > 0 ? (
              <div className="space-y-3">
                {booking.notifications.map((notif) => (
                  <div key={notif.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {notif.type === 'email' ? (
                          <Mail className="h-4 w-4 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                        <span className="font-semibold uppercase text-sm">
                          {notif.type}
                        </span>
                        <Badge variant={notif.status === 'sent' ? 'default' : 'secondary'}>
                          {notif.status}
                        </Badge>
                      </div>
                      {notif.sentAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notif.sentAt), 'MMM d, HH:mm')}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      To: {notif.recipient}
                    </p>
                    
                    {notif.subject && (
                      <p className="text-sm font-semibold mb-1">{notif.subject}</p>
                    )}
                    
                    <p className="text-sm bg-muted p-3 rounded">{notif.message}</p>
                    
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Trigger: {notif.trigger.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No notifications sent yet</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
