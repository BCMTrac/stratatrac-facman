'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

interface ReportsSectionProps {
  onExport: () => void;
}

export function ReportsSection({ onExport }: ReportsSectionProps) {
  const { bookings } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate facility stats
  const facilityStats: Record<string, number> = {};
  bookings.forEach((booking) => {
    facilityStats[booking.category] = (facilityStats[booking.category] || 0) + 1;
  });

  const totalBookings = bookings.length;
  const tennisCourts = Math.round((facilityStats['sports'] || 0) / totalBookings * 100);
  const gymEquipment = Math.round((facilityStats['gym'] || 0) / totalBookings * 100);
  const recreation = Math.round((facilityStats['recreation'] || 0) / totalBookings * 100);

  // Calculate user stats
  const uniqueUsers = new Set(bookings.map(b => b.user.name)).size;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          📊 Facility Reports
        </h2>
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
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Facility Usage */}
        <div className="bg-muted/50 rounded-lg p-5 border-l-4 border-primary">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            📊 Usage Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Tennis Courts</span>
              <strong className="text-foreground">{tennisCourts}%</strong>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Gym Equipment</span>
              <strong className="text-foreground">{gymEquipment}%</strong>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Recreation</span>
              <strong className="text-foreground">{recreation}%</strong>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <strong className="text-2xl text-primary">{totalBookings}</strong>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-muted/50 rounded-lg p-5 border-l-4 border-green-500">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            📝 User Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Active Users</span>
              <strong className="text-foreground">{uniqueUsers}</strong>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">This Week</span>
              <strong className="text-foreground">{totalBookings}</strong>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Peak Time</span>
              <strong className="text-foreground">18:00</strong>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <strong className="text-2xl text-green-600">85%</strong>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}