'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ClientDate } from '@/components/shared/ClientDate';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  FileText,
  MessageSquare,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStatusConfig } from '@/lib/statusConfig';

export default function BookingDetailPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const { bookings, currentUser, updateBookingStatus, sendNotification } = useAppStore();
  
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#001F3F] relative">
        <div className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")', zIndex: 0 }}
        />
        <div className="relative z-10">
          <Header />
          <div className="w-full mx-auto p-4">
            <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-white">Booking Not Found</h2>
                <p className="text-gray-300 mb-4">The booking you're looking for doesn't exist.</p>
                <Link href="/">
                  <Button>Back to Bookings</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status || 'pending');
  const canManage = currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser';
  const isOwnBooking = booking.createdBy === currentUser?.email;

  const handleStatusChange = (newStatus: string) => {
    if (!currentUser) return;
    updateBookingStatus(booking.id, newStatus as any, currentUser.email, `Status updated via booking details page`);
  };

  const handleSendNotification = (type: 'email' | 'sms') => {
    if (!currentUser) return;
    sendNotification(
      booking.id,
      type,
      booking.user.email || booking.user.name,
      `Update regarding your ${booking.facility} booking`,
      'manual_notification'
    );
  };

  return (
    <div className="min-h-screen bg-[#001F3F] relative">
      <div className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")', zIndex: 0 }}
      />
      
      <div className="relative z-10">
        <Header />
        
        <div className="w-full mx-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-4 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Button>
            </Link>
            
            <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{booking.facility}</h1>
                    <Badge className={`${statusConfig.bgColor} text-white`}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-gray-300">Booking ID: {booking.id}</p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-[#00D9FF] text-[#00D9FF]">
                      <Workflow className="h-4 w-4 mr-2" />
                      View Workflow
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Details */}
              <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="font-semibold text-white">{booking.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Time</p>
                        <p className="font-semibold text-white">{booking.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="font-semibold text-white">{booking.duration || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-semibold text-white capitalize">{booking.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#00D9FF]/20" />
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Purpose</p>
                    <p className="text-white">{booking.purpose}</p>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#00D9FF]" />
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-semibold text-white">{booking.user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#00D9FF]" />
                    <div>
                      <p className="text-sm text-gray-400">Unit</p>
                      <p className="font-semibold text-white">{booking.user.unit}</p>
                    </div>
                  </div>
                  
                  {booking.user.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-semibold text-white">{booking.user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#00D9FF]" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="font-semibold text-white">{booking.user.phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status History */}
              {booking.statusHistory && booking.statusHistory.length > 0 && (
                <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Status History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {booking.statusHistory.map((entry, index) => {
                        const config = getStatusConfig(entry.status);
                        return (
                          <div key={entry.timestamp + index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center text-white`}>
                                {config.icon}
                              </div>
                              {index < booking.statusHistory!.length - 1 && (
                                <div className="w-0.5 h-full bg-[#00D9FF]/30 mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-white">{config.label}</p>
                                <ClientDate date={entry.timestamp} className="text-sm text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-300">Updated by: {entry.updatedBy}</p>
                              {entry.note && (
                                <p className="text-sm text-gray-400 mt-1">{entry.note}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Communications */}
              {booking.notifications && booking.notifications.length > 0 && (
                <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Communications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {booking.notifications.map((notification) => (
                        <div key={notification.id} className="bg-[#001F3F]/50 p-4 rounded-lg border border-[#00D9FF]/20">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={notification.type === 'email' ? 'default' : 'secondary'}>
                              {notification.type === 'email' ? '📧 Email' : '💬 SMS'}
                            </Badge>
                            <Badge className={notification.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {notification.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">To: {notification.recipient}</p>
                          {notification.subject && (
                            <p className="text-sm font-semibold text-white mb-1">{notification.subject}</p>
                          )}
                          <p className="text-sm text-gray-400">{notification.message}</p>
                          {notification.sentAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Sent: <ClientDate date={notification.sentAt} />
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {canManage && (
                <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange('confirmed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Booking
                        </Button>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={() => handleStatusChange('rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Booking
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusChange('in-progress')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </Button>
                    )}
                    
                    {booking.status === 'in-progress' && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange('completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Completed
                      </Button>
                    )}
                    
                    <Separator className="bg-[#00D9FF]/20" />
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-[#00D9FF] text-[#00D9FF]"
                      onClick={() => handleSendNotification('email')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#00D9FF] text-[#00D9FF]"
                      onClick={() => handleSendNotification('sms')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send SMS
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* User Actions */}
              {isOwnBooking && booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">My Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleStatusChange('cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Workflow Info */}
              <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    Workflow Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Workflow:</span>
                    <span className="font-semibold text-white">Simple Approval</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stage:</span>
                    <span className="font-semibold text-white">Approval</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Level:</span>
                    <span className="font-semibold text-white">Manager</span>
                  </div>
                  <Separator className="bg-[#00D9FF]/20 my-2" />
                  <Link href="/workflows">
                    <Button variant="outline" size="sm" className="w-full border-[#00D9FF] text-[#00D9FF]">
                      View Full Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
