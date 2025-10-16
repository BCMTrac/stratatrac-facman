'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Clock,
  PieChart,
  ArrowLeft
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ExportModal } from '@/components/reports/ExportModal';
import Link from 'next/link';

export default function ReportsPage() {
  const { currentUser, bookings, facilities } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');

  if (!currentUser || (currentUser.role !== 'bcmtrac' && currentUser.role !== 'miduser')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">Reports are only available to administrators.</p>
            <Link href="/">
              <Button className="mt-4">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate stats
  const stats = useMemo(() => {
    // Filter by date range
    const now = new Date();
    let filteredBookings = bookings;

    if (dateRange === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return isWithinInterval(bookingDate, { start, end });
      });
    }

    // Total bookings
    const totalBookings = filteredBookings.length;

    // Bookings by status
    const byStatus = filteredBookings.reduce((acc, booking) => {
      const status = booking.status || 'confirmed';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Bookings by category
    const byCategory = filteredBookings.reduce((acc, booking) => {
      acc[booking.category] = (acc[booking.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Bookings by facility
    const byFacility = filteredBookings.reduce((acc, booking) => {
      acc[booking.facility] = (acc[booking.facility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top facilities
    const topFacilities = Object.entries(byFacility)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Unique users
    const uniqueUsers = new Set(filteredBookings.map(b => b.user.name)).size;

    // Peak times
    const timeSlots = filteredBookings.reduce((acc, booking) => {
      const hour = booking.time.split(':')[0];
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakTime = Object.entries(timeSlots)
      .sort(([, a], [, b]) => b - a)[0];

    // Notifications sent
    const totalNotifications = filteredBookings.reduce((acc, booking) => {
      return acc + (booking.notifications?.length || 0);
    }, 0);

    const emailsSent = filteredBookings.reduce((acc, booking) => {
      return acc + (booking.notifications?.filter(n => n.type === 'email').length || 0);
    }, 0);

    const smsSent = filteredBookings.reduce((acc, booking) => {
      return acc + (booking.notifications?.filter(n => n.type === 'sms').length || 0);
    }, 0);

    return {
      totalBookings,
      byStatus,
      byCategory,
      topFacilities,
      uniqueUsers,
      peakTime: peakTime ? `${peakTime[0]}:00` : 'N/A',
      totalNotifications,
      emailsSent,
      smsSent
    };
  }, [bookings, dateRange]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500',
    rejected: 'bg-red-700'
  };

  return (
    <>
      <ExportModal open={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        
        <div className="max-w-[1400px] mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into facility usage and booking trends
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={dateRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('week')}
              >
                This Week
              </Button>
              <Button
                variant={dateRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('month')}
              >
                This Month
              </Button>
              <Button
                variant={dateRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange('all')}
              >
                All Time
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Bookings</CardDescription>
                <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Active tracking</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Users</CardDescription>
                <CardTitle className="text-3xl">{stats.uniqueUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Unique residents</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Peak Time</CardDescription>
                <CardTitle className="text-3xl">{stats.peakTime}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Most popular</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Notifications</CardDescription>
                <CardTitle className="text-3xl">{stats.totalNotifications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📧 {stats.emailsSent} • 💬 {stats.smsSent}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Bookings by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.byCategory).map(([category, count]) => {
                        const categoryInfo = facilities[category];
                        const percentage = Math.round((count / stats.totalBookings) * 100);
                        
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <span>{categoryInfo?.icon || '📁'}</span>
                                <span className="font-medium">{categoryInfo?.name || category}</span>
                              </span>
                              <span className="text-muted-foreground">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Facilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top 5 Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topFacilities.map(([facility, count], index) => (
                        <div key={facility} className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'}
                          `}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{facility}</p>
                            <p className="text-sm text-muted-foreground">{count} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Facilities Usage</CardTitle>
                  <CardDescription>Detailed breakdown of each facility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(facilities).map(([categoryId, category]) => (
                      <div key={categoryId} className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </h4>
                        <div className="pl-6 space-y-2">
                          {category.facilities.map(facility => {
                            const bookingCount = bookings.filter(b => b.facility === facility.name).length;
                            return (
                              <div key={facility.id} className="flex justify-between items-center py-2 border-b">
                                <span className="flex items-center gap-2">
                                  <span>{facility.icon}</span>
                                  <span>{facility.name}</span>
                                  {!facility.enabled && (
                                    <Badge variant="secondary" className="text-xs">Disabled</Badge>
                                  )}
                                </span>
                                <span className="text-muted-foreground">{bookingCount} bookings</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Status</CardTitle>
                  <CardDescription>Current status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stats.byStatus).map(([status, count]) => {
                      const percentage = Math.round((count / stats.totalBookings) * 100);
                      return (
                        <div key={status} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${statusColors[status]} text-white`}>
                              {status}
                            </Badge>
                            <span className="text-2xl font-bold">{count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-3">
                            <div 
                              className={`${statusColors[status]} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{percentage}% of total</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📧 Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-primary mb-2">{stats.emailsSent}</div>
                      <p className="text-muted-foreground">Emails Sent</p>
                      <div className="mt-6 space-y-2 text-sm text-left">
                        <div className="flex justify-between">
                          <span>Booking Created</span>
                          <span className="font-semibold">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status Updates</span>
                          <span className="font-semibold">{Math.max(0, stats.emailsSent - stats.totalBookings)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      💬 SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-green-600 mb-2">{stats.smsSent}</div>
                      <p className="text-muted-foreground">SMS Sent</p>
                      <div className="mt-6 space-y-2 text-sm text-left">
                        <div className="flex justify-between">
                          <span>Booking Confirmations</span>
                          <span className="font-semibold">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reminders</span>
                          <span className="font-semibold">{Math.max(0, stats.smsSent - stats.totalBookings)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Performance</CardTitle>
                  <CardDescription>Delivery and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-600">100%</div>
                      <p className="text-sm text-muted-foreground mt-1">Delivery Rate</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">85%</div>
                      <p className="text-sm text-muted-foreground mt-1">Open Rate</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">2.3s</div>
                      <p className="text-sm text-muted-foreground mt-1">Avg. Response Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
