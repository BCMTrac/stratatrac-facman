'use client';

import { useState } from 'react';
import { WorkflowDashboard } from '@/components/workflow/WorkflowDashboard';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Loader2,
  Calendar,
  User,
  Building,
  Clock
} from 'lucide-react';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';

export function WorkflowDashboardContainer() {
  const { workflows, workflowExecutions, executeWorkflow } = useAppStore();
  const [drilldownBookings, setDrilldownBookings] = useState<Booking[] | null>(null);
  const [drilldownStatus, setDrilldownStatus] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleDrillDown = (bookings: Booking[], status: string) => {
    setDrilldownBookings(bookings);
    setDrilldownStatus(status);
    setSelectedBookingId(null);
  };

  const handleBack = () => {
    setDrilldownBookings(null);
    setSelectedBookingId(null);
  };

  const handleRunWorkflow = (bookingId: string) => {
    const workflow = workflows[0];
    if (!workflow) {
      toast.error('No workflows available');
      return;
    }
    setSelectedBookingId(bookingId);
    executeWorkflow(workflow.id, bookingId);
    toast.success('Workflow started!');
  };

  const activeExecution = workflowExecutions.find(
    e => e.status === 'running' && e.bookingId === selectedBookingId
  );
  const progress = activeExecution 
    ? (activeExecution.executionLog.length / (workflows.find(w => w.id === activeExecution.workflowId)?.nodes.length || 1)) * 100
    : 0;

  // Show dashboard
  if (!drilldownBookings) {
    return <WorkflowDashboard onDrillDown={handleDrillDown} />;
  }

  // Show drilldown view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-[#00D9FF] hover:bg-[#002850]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">{drilldownStatus} Bookings</h2>
          <p className="text-gray-400">{drilldownBookings.length} total</p>
        </div>
      </div>

      {/* Active Execution Banner */}
      {activeExecution && (
        <Card className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 border-2 border-blue-400 animate-in slide-in-from-top">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                <div>
                  <div className="text-white font-bold">Workflow Executing</div>
                  <div className="text-blue-200 text-sm">
                    {workflows.find(w => w.id === activeExecution.workflowId)?.name}
                  </div>
                </div>
              </div>
              <Badge className="bg-blue-500 text-white">
                {activeExecution.executionLog.length} steps
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drilldownBookings.map(booking => {
          const isExecuting = selectedBookingId === booking.id && activeExecution;
          const execution = workflowExecutions.find(e => e.bookingId === booking.id);

          return (
            <Card 
              key={booking.id}
              className={`bg-[#002850]/90 backdrop-blur-sm border transition-all duration-300 ${
                isExecuting 
                  ? 'border-blue-400 shadow-lg shadow-blue-400/50' 
                  : 'border-[#00D9FF]/30 hover:border-[#00D9FF]/60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Building className="h-5 w-5 text-[#00D9FF]" />
                      {booking.facility}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {booking.user.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </div>
                  <Badge className={`
                    ${booking.status === 'pending' ? 'bg-yellow-600' : ''}
                    ${booking.status === 'approved' ? 'bg-green-600' : ''}
                    ${booking.status === 'confirmed' ? 'bg-blue-600' : ''}
                    ${booking.status === 'rejected' ? 'bg-red-600' : ''}
                  `}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isExecuting ? (
                  <div className="space-y-2">
                    <div className="text-blue-400 text-sm font-semibold mb-2">Executing Workflow</div>
                    {activeExecution.executionLog.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-blue-950/50 rounded p-2 animate-in slide-in-from-left">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-white font-medium">{log.action}</div>
                          <div className="text-gray-400">{log.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : execution ? (
                  <div className="text-sm text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-400">Workflow completed</span>
                    </div>
                    <div className="text-xs">
                      {execution.executionLog.length} steps • 
                      {execution.completedAt && ` ${Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)}s`}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRunWorkflow(booking.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Workflow
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
