'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WORKFLOW_PERMISSIONS, canUserChangeStatus } from '@/lib/permissions';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { getStatusConfig } from '@/lib/statusConfig';

export function ApprovalsQueue() {
  const { bookings, updateBookingStatus, currentUser } = useAppStore();

  if (!currentUser) return null;

  const permissions = WORKFLOW_PERMISSIONS[currentUser.role];

  if (!permissions.canApprove) {
    return (
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardContent className="py-12 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Access Denied</p>
          <p className="text-gray-500 text-sm mt-2">You don't have permission to approve bookings</p>
        </CardContent>
      </Card>
    );
  }

  const pendingApprovals = bookings.filter(b => 
    b.status === 'pending' || b.status === 'in-progress'
  );

  const handleApprove = (bookingId: string) => {
    if (!currentUser) return;
    updateBookingStatus(bookingId, 'confirmed', currentUser.email, 'Approved via workflow approvals queue');
  };

  const handleReject = (bookingId: string) => {
    if (!currentUser) return;
    updateBookingStatus(bookingId, 'rejected', currentUser.email, 'Rejected via workflow approvals queue');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Pending Approvals</h3>
        <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-lg px-4 py-1">
          {pendingApprovals.length} Pending
        </Badge>
      </div>

      {pendingApprovals.length === 0 ? (
        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">All caught up!</p>
            <p className="text-gray-500 text-sm mt-2">No bookings awaiting approval</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map(booking => {
            const statusConfig = getStatusConfig(booking.status || 'pending');
            
            return (
              <Card key={booking.id} className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30 hover:border-[#00D9FF]/60 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white text-lg">{booking.facility}</CardTitle>
                        <Badge className={statusConfig.bgColor}>
                          {statusConfig.icon} {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">Booking ID: {booking.id}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-[#00D9FF]" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold text-white">{booking.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4 text-[#00D9FF]" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold text-white">{booking.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="h-4 w-4 text-[#00D9FF]" />
                      <div>
                        <p className="text-xs text-gray-500">Resident</p>
                        <p className="font-semibold text-white">{booking.user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-[#00D9FF]" />
                      <div>
                        <p className="text-xs text-gray-500">Unit</p>
                        <p className="font-semibold text-white">{booking.user.unit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="text-white">{booking.purpose}</p>
                  </div>

                  {booking.statusHistory && booking.statusHistory.length > 0 && (
                    <div className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                      <p className="text-xs text-gray-500 mb-2">Recent Activity</p>
                      <div className="space-y-1">
                        {booking.statusHistory.slice(-3).reverse().map((entry, idx) => (
                          <p key={idx} className="text-xs text-gray-400">
                            {new Date(entry.timestamp).toLocaleString()} - {entry.status} by {entry.updatedBy}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {canUserChangeStatus(currentUser.role, booking.status || 'pending', 'confirmed') && (
                      <Button
                        onClick={() => handleApprove(booking.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {canUserChangeStatus(currentUser.role, booking.status || 'pending', 'rejected') && (
                      <Button
                        onClick={() => handleReject(booking.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white">Approval Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{pendingApprovals.length}</p>
              <p className="text-sm text-gray-400 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-400 mt-1">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">
                {bookings.filter(b => b.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-400 mt-1">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
