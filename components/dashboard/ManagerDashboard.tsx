'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Truck,
  Bell,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { BOOKING_STATUSES } from '@/lib/statusConfig';
import { useMemo } from 'react';

export function ManagerDashboard() {
  const { bookings } = useAppStore();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      today: bookings.filter(b => b.date === today).length,
      moveRequests: bookings.filter(b => b.category === 'moveinout').length,
      pendingMoves: bookings.filter(b => b.category === 'moveinout' && b.status === 'pending').length,
    };
  }, [bookings]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#00D9FF]" />
          Facility Manager Dashboard
        </h1>
        <p className="text-gray-300 mt-2">
          Manage bookings, approve requests, and monitor facility usage
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#00D9FF]" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.today}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-500" />
              Moves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{stats.moveRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#00D9FF]" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(BOOKING_STATUSES).map(([key, config]) => {
            const count = bookings.filter(b => b.status === key).length;
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${config.bgColor} text-white`}>
                    {config.icon} {config.label}
                  </Badge>
                </div>
                <span className="text-lg font-bold text-white">{count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/">
          <Card className="bg-gradient-to-br from-[#00D9FF]/20 to-[#0099CC]/20 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] cursor-pointer transition-all hover:scale-105">
            <CardContent className="pt-6 text-center">
              <Bell className="h-12 w-12 text-[#00D9FF] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Manage Bookings</h3>
              <p className="text-sm text-gray-300">View and approve requests</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-500 cursor-pointer transition-all hover:scale-105">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">View Reports</h3>
              <p className="text-sm text-gray-300">Analytics & usage</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
