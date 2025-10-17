'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Mail,
  MessageSquare,
  Truck,
  Bell,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { BOOKING_STATUSES } from '@/lib/statusConfig';
import { useMemo } from 'react';

export function AdminDashboard() {
  const { bookings, auditLogs } = useAppStore();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekAgo = thisWeek.toISOString().split('T')[0];

    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      inProgress: bookings.filter(b => b.status === 'in-progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      today: bookings.filter(b => b.date === today).length,
      thisWeek: bookings.filter(b => b.date >= weekAgo).length,
      moveRequests: bookings.filter(b => b.category === 'moveinout').length,
      pendingMoves: bookings.filter(b => b.category === 'moveinout' && b.status === 'pending').length,
      notifications: bookings.reduce((acc, b) => acc + (b.notifications?.length || 0), 0),
      recentActions: auditLogs.slice(0, 10)
    };
  }, [bookings, auditLogs]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </Link>
      
      {/* Header */}
      <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="h-8 w-8 text-[#00D9FF]" />
          System Administrator Dashboard
        </h1>
        <p className="text-gray-300 mt-2">
          Complete overview of all bookings, requests, and system activity
        </p>
      </div>

      {/* Quick Stats Grid */}
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
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <p className="text-xs text-gray-400 mt-1">Requires action</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Confirmed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.today}</div>
            <p className="text-xs text-gray-400 mt-1">Active bookings</p>
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
            <p className="text-xs text-gray-400 mt-1">{stats.pendingMoves} pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00D9FF]" />
              Booking Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(BOOKING_STATUSES).map(([key, config]) => {
              const count = bookings.filter(b => b.status === key).length;
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`${config.bgColor} text-white`}>
                      {config.icon} {config.label}
                    </Badge>
                    <span className="text-sm text-gray-300">{config.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">{count}</span>
                    <span className="text-sm text-gray-400 w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#00D9FF]" />
              Communications Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Sent to users and admins</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {bookings.reduce((acc, b) => 
                  acc + (b.notifications?.filter(n => n.type === 'email').length || 0), 0
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Quick mobile alerts</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-400">
                {bookings.reduce((acc, b) => 
                  acc + (b.notifications?.filter(n => n.type === 'sms').length || 0), 0
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Audit Log Entries</p>
                  <p className="text-sm text-gray-400">System activity tracking</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-400">{auditLogs.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#00D9FF]" />
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentActions.length > 0 ? (
              stats.recentActions.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/20">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {log.userName} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin">
          <Card className="bg-gradient-to-br from-[#00D9FF]/20 to-[#0099CC]/20 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] cursor-pointer transition-all hover:scale-105">
            <CardContent className="pt-6 text-center">
              <Activity className="h-12 w-12 text-[#00D9FF] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">System Settings</h3>
              <p className="text-sm text-gray-300">Configure facilities & settings</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-500 cursor-pointer transition-all hover:scale-105">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">View Reports</h3>
              <p className="text-sm text-gray-300">Analytics & insights</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-sm border-2 border-green-500/30 hover:border-green-500 cursor-pointer transition-all hover:scale-105">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Manage Bookings</h3>
              <p className="text-sm text-gray-300">View all bookings</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
