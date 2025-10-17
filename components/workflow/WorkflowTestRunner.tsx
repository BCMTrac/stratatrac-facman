'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { WorkflowEngine } from '@/lib/workflows/engine';

export function WorkflowTestRunner({ workflowId }: { workflowId: string }) {
  const { workflows, bookings, updateBookingStatus, sendNotification } = useAppStore();
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const workflow = workflows.find(w => w.id === workflowId);
  const testableBookings = bookings.slice(0, 10); // Show first 10 for testing

  const runTest = async () => {
    if (!workflow || !selectedBookingId) return;

    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return;

    setIsRunning(true);
    setTestResult(null);

    try {
      const execution = await WorkflowEngine.executeWorkflow(
        workflow,
        booking,
        updateBookingStatus,
        sendNotification
      );

      setTestResult(execution);
    } catch (error) {
      setTestResult({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!workflow) return null;

  return (
    <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Play className="h-5 w-5 text-[#00D9FF]" />
          Test Workflow: {workflow.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Select Test Booking</label>
          <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
            <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white">
              <SelectValue placeholder="Choose a booking to test with..." />
            </SelectTrigger>
            <SelectContent>
              {testableBookings.map(booking => (
                <SelectItem key={booking.id} value={booking.id}>
                  {booking.facility} - {booking.user.name} ({booking.date})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={runTest}
          disabled={!selectedBookingId || isRunning}
          className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0099CC]"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Test...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </>
          )}
        </Button>

        {testResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/20">
              <span className="text-white font-semibold">Test Result</span>
              <Badge className={
                testResult.status === 'completed' ? 'bg-green-500' :
                testResult.status === 'running' ? 'bg-blue-500' :
                'bg-red-500'
              }>
                {testResult.status}
              </Badge>
            </div>

            {testResult.error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{testResult.error}</p>
              </div>
            )}

            {testResult.executionLog && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Execution Log:</p>
                <ScrollArea className="h-64 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/20 p-3">
                  <div className="space-y-2">
                    {testResult.executionLog.map((log: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {log.result === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {log.nodeType}
                            </Badge>
                            <span className="text-gray-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-white mt-1">{log.action}</p>
                          <p className="text-gray-400">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#001F3F]/50 p-2 rounded border border-[#00D9FF]/20">
                <span className="text-gray-400">Started</span>
                <p className="text-white">{new Date(testResult.startedAt).toLocaleString()}</p>
              </div>
              {testResult.completedAt && (
                <div className="bg-[#001F3F]/50 p-2 rounded border border-[#00D9FF]/20">
                  <span className="text-gray-400">Completed</span>
                  <p className="text-white">{new Date(testResult.completedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-300">
              <p className="font-semibold mb-1">Test Mode</p>
              <p>This test runs the workflow without permanently changing the booking. Use this to verify your workflow logic before activating it.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
