'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

export function NotificationsSidebar() {
  const { bookings, currentUser } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Get all notifications for current user
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];

    let relevantBookings = bookings;

    // Filter bookings based on user role
    if (currentUser.role === 'standard') {
      // Residents only see their own booking notifications
      relevantBookings = bookings.filter(b => b.createdBy === currentUser.email);
    }
    // Admins and managers see all notifications

    // Collect all notifications from relevant bookings
    const allNotifs = relevantBookings
      .flatMap(booking => 
        (booking.notifications || []).map(notif => ({
          ...notif,
          bookingId: booking.id,
          bookingFacility: booking.facility,
          bookingDate: booking.date,
          bookingStatus: booking.status
        }))
      )
      .sort((a, b) => {
        const dateA = new Date(a.sentAt || 0).getTime();
        const dateB = new Date(b.sentAt || 0).getTime();
        return dateB - dateA; // Most recent first
      });

    return allNotifs;
  }, [bookings, currentUser]);

  // Count notifications by type
  const stats = useMemo(() => {
    const total = userNotifications.length;
    const emails = userNotifications.filter(n => n.type === 'email').length;
    const sms = userNotifications.filter(n => n.type === 'sms').length;
    const recent = userNotifications.filter(n => {
      const sentDate = new Date(n.sentAt || 0);
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return sentDate > dayAgo;
    }).length;

    return { total, emails, sms, recent };
  }, [userNotifications]);

  const getNotificationIcon = (type: 'email' | 'sms') => {
    return type === 'email' ? (
      <Mail className="h-4 w-4 text-blue-400" />
    ) : (
      <MessageSquare className="h-4 w-4 text-green-400" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 top-24 z-50 bg-gradient-to-br from-[#00D9FF] to-[#0099CC] hover:from-[#00C5E6] hover:to-[#0086B3] text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
      >
        <div className="relative">
          <Bell className="h-6 w-6" />
          {stats.recent > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {stats.recent > 9 ? '9+' : stats.recent}
            </span>
          )}
        </div>
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-[#001F3F] border-l-2 border-[#00D9FF]/30 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-[#002850]/90 backdrop-blur-sm border-b-2 border-[#00D9FF]/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-[#00D9FF]" />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#001F3F]/50 rounded-lg p-2 text-center border border-[#00D9FF]/20">
                <div className="text-2xl font-bold text-[#00D9FF]">{stats.total}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-2 text-center border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">{stats.emails}</div>
                <div className="text-xs text-gray-400">Emails</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{stats.sms}</div>
                <div className="text-xs text-gray-400">SMS</div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4">
            {userNotifications.length > 0 ? (
              <div className="space-y-3">
                {userNotifications.map((notif: any) => (
                  <Card key={notif.id} className="bg-[#002850]/50 backdrop-blur-sm border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all">
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notif.type)}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              notif.type === 'email' 
                                ? 'border-blue-500/50 text-blue-400' 
                                : 'border-green-500/50 text-green-400'
                            }`}
                          >
                            {notif.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(notif.status)}
                          <span className="text-xs text-gray-500 capitalize">{notif.status}</span>
                        </div>
                      </div>

                      {/* Booking Info */}
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-white">{notif.bookingFacility}</p>
                        <p className="text-xs text-gray-400">
                          Booking #{notif.bookingId} • {format(new Date(notif.bookingDate), 'MMM d, yyyy')}
                        </p>
                      </div>

                      {/* Recipient */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">To: <span className="text-gray-300">{notif.recipient}</span></p>
                      </div>

                      {/* Message */}
                      <div className="bg-[#001F3F]/50 rounded p-2 mb-2">
                        <p className="text-xs text-gray-300 line-clamp-3">{notif.message}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {notif.sentAt ? format(new Date(notif.sentAt), 'MMM d, h:mm a') : 'Pending'}
                        </span>
                        <Badge variant="outline" className="text-xs border-[#00D9FF]/30 text-gray-400">
                          {notif.trigger.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bell className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-2">No Notifications</p>
                <p className="text-gray-500 text-sm">
                  {currentUser?.role === 'standard' 
                    ? 'Your booking notifications will appear here'
                    : 'System notifications will appear here'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {userNotifications.length > 0 && (
            <div className="bg-[#002850]/90 backdrop-blur-sm border-t-2 border-[#00D9FF]/30 p-4">
              <p className="text-xs text-center text-gray-400">
                {currentUser?.role === 'standard' 
                  ? 'Showing notifications for your bookings'
                  : currentUser?.role === 'bcmtrac'
                  ? 'Showing all system notifications'
                  : 'Showing all booking notifications'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
