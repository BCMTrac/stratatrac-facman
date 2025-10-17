'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  ChevronRight, 
  ArrowLeft,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Booking } from '@/lib/types';

interface RequestGroup {
  requestId: string;
  bookings: Booking[];
  totalBookings: number;
  user: string;
  statuses: string[];
  latestDate: string;
}

export function AnimatedDashboard() {
  const { bookings } = useAppStore();
  const [selectedGroup, setSelectedGroup] = useState<RequestGroup | null>(null);

  // Debug log
  console.log('[AnimatedDashboard] Bookings:', bookings?.length || 0);

  // If no bookings, show empty state
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No bookings available</p>
        <p className="text-gray-500 text-sm mt-2">Create some bookings to see the animated dashboard!</p>
      </div>
    );
  }

  // Group bookings by Request ID (we'll use user.unit + date as pseudo request ID)
  const groupedRequests: RequestGroup[] = Object.values(
    bookings.reduce((acc, booking) => {
      // Create request ID from user unit + date
      const requestId = `${booking.user.unit}-${booking.date.split('T')[0]}`;
      
      if (!acc[requestId]) {
        acc[requestId] = {
          requestId,
          bookings: [],
          totalBookings: 0,
          user: booking.user.name,
          statuses: [],
          latestDate: booking.date
        };
      }
      
      acc[requestId].bookings.push(booking);
      acc[requestId].totalBookings++;
      if (!acc[requestId].statuses.includes(booking.status)) {
        acc[requestId].statuses.push(booking.status);
      }
      
      return acc;
    }, {} as Record<string, RequestGroup>)
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 217, 255, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const statsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  const getStatusColor = (statuses: string[]) => {
    if (statuses.includes('rejected')) return 'from-red-500 to-red-600';
    if (statuses.includes('confirmed')) return 'from-green-500 to-green-600';
    if (statuses.includes('approved')) return 'from-blue-500 to-blue-600';
    return 'from-yellow-500 to-yellow-600';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'approved': return 'bg-blue-600';
      case 'confirmed': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (selectedGroup) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <Button
          onClick={() => setSelectedGroup(null)}
          variant="outline"
          className="border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>

        {/* Request Details Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`bg-gradient-to-r ${getStatusColor(selectedGroup.statuses)} border-none text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Request ID</div>
                  <div className="text-3xl font-bold mt-1">{selectedGroup.requestId}</div>
                  <div className="text-sm mt-2 opacity-90">
                    <User className="inline h-4 w-4 mr-1" />
                    {selectedGroup.user}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{selectedGroup.totalBookings}</div>
                  <div className="text-sm opacity-90">Total Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {selectedGroup.bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Building className="h-5 w-5 text-[#00D9FF]" />
                        {booking.facility}
                      </CardTitle>
                      <div className="text-sm text-gray-400 mt-2">
                        {booking.purpose || booking.category}
                      </div>
                    </div>
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#00D9FF]" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#00D9FF]" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    {booking.statusHistory && booking.statusHistory.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#00D9FF]/20">
                        <div className="text-xs text-gray-400">
                          Last updated: {new Date(booking.statusHistory[booking.statusHistory.length - 1].timestamp).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={statsVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Total Requests</div>
                  <div className="text-4xl font-bold mt-2">{groupedRequests.length}</div>
                </div>
                <Activity className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Total Bookings</div>
                  <div className="text-4xl font-bold mt-2">{bookings.length}</div>
                </div>
                <Building className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={statsVariants}>
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Avg per Request</div>
                  <div className="text-4xl font-bold mt-2">
                    {(bookings.length / groupedRequests.length || 0).toFixed(1)}
                  </div>
                </div>
                <TrendingUp className="h-12 w-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Request Groups */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Booking Requests</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {groupedRequests.map((group, index) => (
              <motion.div
                key={group.requestId}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                layout
                onClick={() => setSelectedGroup(group)}
                className="cursor-pointer"
              >
                <Card className={`bg-gradient-to-br ${getStatusColor(group.statuses)} border-none text-white overflow-hidden relative`}>
                  {/* Animated background pulse */}
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm opacity-90">Request ID</div>
                        <div className="text-xl font-bold mt-1 break-all">
                          {group.requestId}
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 flex-shrink-0" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{group.user}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{group.totalBookings} booking{group.totalBookings !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(group.latestDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {group.statuses.map(status => (
                          <Badge
                            key={status}
                            className="bg-white/20 text-white text-xs"
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* View Details Indicator */}
                    <motion.div
                      className="mt-4 pt-3 border-t border-white/20 text-sm font-semibold flex items-center justify-between"
                      whileHover={{ x: 5 }}
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
