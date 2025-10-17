'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Booking } from '@/lib/types';
import { workflowTemplates } from '@/lib/workflows/templates';
import { toast } from 'sonner';

interface WorkflowDashboardProps {
  onDrillDown?: (bookings: Booking[], status: string) => void;
}

export function WorkflowDashboard({ onDrillDown }: WorkflowDashboardProps) {
  const { bookings, workflows, workflowExecutions, addWorkflow, currentUser, executeWorkflow } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Auto-load templates as workflows if none exist
  const initializeWorkflows = () => {
    if (workflows.length === 0 && currentUser) {
      workflowTemplates.forEach(template => {
        addWorkflow({
          ...template,
          createdBy: currentUser.email
        });
      });
      toast.success('Workflows initialized!');
    }
  };

  // Group bookings by status
  const bookingsByStatus = {
    pending: bookings.filter(b => b.status === 'pending'),
    approved: bookings.filter(b => b.status === 'approved'),
    confirmed: bookings.filter(b => b.status === 'confirmed'),
    rejected: bookings.filter(b => b.status === 'rejected'),
  };

  // Get execution stats
  const executionStats = {
    running: workflowExecutions.filter(e => e.status === 'running').length,
    completed: workflowExecutions.filter(e => e.status === 'completed').length,
    failed: workflowExecutions.filter(e => e.status === 'failed').length,
  };

  const handleCardClick = (status: string, bookingList: Booking[]) => {
    setSelectedStatus(status);
    if (onDrillDown) {
      onDrillDown(bookingList, status);
    }
  };

  const handleRunWorkflow = (bookingId: string) => {
    // Auto-select appropriate workflow based on booking
    const workflow = workflows[0]; // Use first workflow for demo
    if (!workflow) {
      initializeWorkflows();
      return;
    }
    executeWorkflow(workflow.id, bookingId);
    toast.success('Workflow started!');
  };

  const statusConfig = {
    pending: {
      color: 'from-yellow-600 to-yellow-700',
      icon: Clock,
      label: 'Pending Approval',
      count: bookingsByStatus.pending.length
    },
    approved: {
      color: 'from-green-600 to-green-700',
      icon: CheckCircle,
      label: 'Approved',
      count: bookingsByStatus.approved.length
    },
    confirmed: {
      color: 'from-blue-600 to-blue-700',
      icon: CheckCircle,
      label: 'Confirmed',
      count: bookingsByStatus.confirmed.length
    },
    rejected: {
      color: 'from-red-600 to-red-700',
      icon: XCircle,
      label: 'Rejected',
      count: bookingsByStatus.rejected.length
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Total Workflows</div>
                <div className="text-3xl font-bold mt-1">{workflows.length}</div>
              </div>
              <Play className="h-8 w-8 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Running Now</div>
                <div className="text-3xl font-bold mt-1 flex items-center gap-2">
                  {executionStats.running}
                  {executionStats.running > 0 && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
              </div>
              <Loader2 className="h-8 w-8 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Completed</div>
                <div className="text-3xl font-bold mt-1">{executionStats.completed}</div>
              </div>
              <CheckCircle className="h-8 w-8 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Failed</div>
                <div className="text-3xl font-bold mt-1">{executionStats.failed}</div>
              </div>
              <XCircle className="h-8 w-8 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Status Cards - Drillable */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Bookings by Workflow Status</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const bookingList = bookingsByStatus[status as keyof typeof bookingsByStatus];
            const isSelected = selectedStatus === status;

            return (
              <Card 
                key={status}
                className={`bg-gradient-to-br ${config.color} border-none text-white cursor-pointer hover:scale-105 transition-all duration-300 ${isSelected ? 'ring-4 ring-white' : ''}`}
                onClick={() => handleCardClick(status, bookingList)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-10 w-10" />
                      <div>
                        <div className="text-lg font-bold">{config.label}</div>
                        <div className="text-sm opacity-90">{config.count} bookings</div>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6" />
                  </div>

                  {/* Preview bookings */}
                  {bookingList.length > 0 && (
                    <div className="space-y-2 mt-4 border-t border-white/20 pt-4">
                      {bookingList.slice(0, 3).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between bg-white/10 rounded p-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{booking.facility}</div>
                            <div className="text-xs opacity-75">{booking.user.name}</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRunWorkflow(booking.id);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white border-none h-7 px-2"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {bookingList.length > 3 && (
                        <div className="text-xs opacity-75 text-center">
                          +{bookingList.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      {workflows.length === 0 && (
        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
          <CardContent className="p-6 text-center">
            <p className="text-white mb-4">No workflows found. Initialize default workflows?</p>
            <Button
              onClick={initializeWorkflows}
              className="bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold"
            >
              <Play className="h-4 w-4 mr-2" />
              Initialize Workflows
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
