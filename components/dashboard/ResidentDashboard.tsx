'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock,
  CheckCircle,
  Truck,
  User,
  Plus,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { BOOKING_STATUSES, getStatusConfig } from '@/lib/statusConfig';
import { useMemo } from 'react';
import { format } from 'date-fns';

export function ResidentDashboard() {
  const { bookings, currentUser, setBookingModalOpen, setMoveInOutModalOpen } = useAppStore();

  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter(b => b.createdBy === currentUser.email);
  }, [bookings, currentUser]);

  const stats = useMemo(() => {
    const upcoming = myBookings.filter(b => {
      const bookingDate = new Date(b.date);
      const today = new Date();
      return bookingDate >= today && (b.status === 'confirmed' || b.status === 'pending');
    });

    return {
      total: myBookings.length,
      upcoming: upcoming.length,
      pending: myBookings.filter(b => b.status === 'pending').length,
      confirmed: myBookings.filter(b => b.status === 'confirmed').length,
      cancelled: myBookings.filter(b => b.status === 'cancelled').length,
      moveRequests: myBookings.filter(b => b.category === 'moveinout').length,
    };
  }, [myBookings]);

  const upcomingBookings = useMemo(() => {
    return myBookings
      .filter(b => {
        const bookingDate = new Date(b.date);
        const today = new Date();
        return bookingDate >= today && (b.status === 'confirmed' || b.status === 'pending');
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [myBookings]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Home className="h-8 w-8 text-[#00D9FF]" />
          My Dashboard
        </h1>
        <p className="text-gray-300 mt-2">
          Welcome back, {currentUser?.name}! Manage your bookings and requests.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#00D9FF]" />
              My Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.upcoming}</div>
            <p className="text-xs text-gray-400 mt-1">Confirmed & pending</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-500" />
              Move Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{stats.moveRequests}</div>
            <p className="text-xs text-gray-400 mt-1">Total moves</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#00D9FF]" />
              Upcoming Bookings
            </CardTitle>
            <Link href="/">
              <Button size="sm" variant="outline" className="border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-white">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status || 'pending');
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/20">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#00D9FF]">
                          {format(new Date(booking.date), 'd')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(booking.date), 'MMM')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{booking.facility}</h4>
                        <p className="text-sm text-gray-400">{booking.time} • {booking.purpose}</p>
                      </div>
                    </div>
                    <Badge className={`${statusConfig.bgColor} text-white`}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No upcoming bookings</p>
              <p className="text-sm text-gray-500 mt-1">Make a booking to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Status Breakdown */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-[#00D9FF]" />
            My Booking Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(BOOKING_STATUSES).map(([key, config]) => {
            const count = myBookings.filter(b => b.status === key).length;
            
            if (count === 0) return null;
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${config.bgColor} text-white`}>
                    {config.icon} {config.label}
                  </Badge>
                  <span className="text-sm text-gray-300">{config.description}</span>
                </div>
                <span className="text-lg font-bold text-white">{count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="bg-gradient-to-br from-[#00D9FF]/20 to-[#0099CC]/20 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] cursor-pointer transition-all hover:scale-105"
          onClick={() => setBookingModalOpen(true)}
        >
          <CardContent className="pt-6 text-center">
            <Plus className="h-12 w-12 text-[#00D9FF] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">New Booking</h3>
            <p className="text-sm text-gray-300">Book a facility or amenity</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-orange-500/20 to-orange-700/20 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500 cursor-pointer transition-all hover:scale-105"
          onClick={() => setMoveInOutModalOpen(true)}
        >
          <CardContent className="pt-6 text-center">
            <Truck className="h-12 w-12 text-orange-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Move Request</h3>
            <p className="text-sm text-gray-300">Request move in/out</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
