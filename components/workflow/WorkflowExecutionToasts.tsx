'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Zap, Clock, User, Building, X } from 'lucide-react';

interface ToastInfo {
  id: string;
  log: any;
  timestamp: number;
}

export function WorkflowExecutionToasts() {
  const { workflowExecutions, workflows, bookings } = useAppStore();
  const [visibleToasts, setVisibleToasts] = useState<ToastInfo[]>([]);
  const [lastLogCount, setLastLogCount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const activeExecution = workflowExecutions.find(e => e.status === 'running');
    if (!activeExecution) {
      setVisibleToasts([]);
      return;
    }

    const currentLogCount = activeExecution.executionLog.length;
    const previousCount = lastLogCount[activeExecution.id] || 0;

    if (currentLogCount > previousCount) {
      // New log entry added
      const newLog = activeExecution.executionLog[currentLogCount - 1];
      const toastId = `${activeExecution.id}-${currentLogCount}`;
      
      const newToast: ToastInfo = {
        id: toastId,
        log: newLog,
        timestamp: Date.now()
      };
      
      setVisibleToasts(prev => [...prev, newToast]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setVisibleToasts(prev => prev.filter(t => t.id !== toastId));
      }, 5000);

      setLastLogCount(prev => ({ ...prev, [activeExecution.id]: currentLogCount }));
    }
  }, [workflowExecutions]);

  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const workflow = workflows.find(w => w.id === activeExecution?.workflowId);
  const booking = bookings.find(b => b.id === activeExecution?.bookingId);

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md pointer-events-none">
      {visibleToasts.map((toast) => {
        const log = toast.log;
        let icon = <CheckCircle className="h-5 w-5" />;
        let bgColor = 'from-blue-600 to-blue-700';
        let details = null;

        if (log.nodeType === 'notification') {
          icon = <Mail className="h-5 w-5 animate-bounce" />;
          bgColor = 'from-purple-600 to-purple-700';
          const match = log.details.match(/sent to (.+)/);
          details = match ? (
            <div className="flex items-center gap-2 mt-2 text-sm bg-white/10 rounded p-2">
              <User className="h-4 w-4" />
              <div>
                <div className="font-semibold">Sending to:</div>
                <div className="text-xs opacity-90">{match[1]}</div>
              </div>
            </div>
          ) : null;
        } else if (log.nodeType === 'status') {
          icon = <Zap className="h-5 w-5 animate-pulse" />;
          bgColor = 'from-blue-600 to-blue-700';
          const match = log.action.match(/Changed status to (.+)/);
          details = match ? (
            <div className="flex items-center gap-2 mt-2 text-sm bg-white/10 rounded p-2">
              <div className="flex-1">
                <div className="font-semibold">New Status:</div>
                <Badge className="bg-white/20 mt-1">{match[1]}</Badge>
              </div>
              <div className="text-xs opacity-75">
                <Building className="h-3 w-3 inline mr-1" />
                {booking?.facility}
              </div>
            </div>
          ) : null;
        } else if (log.nodeType === 'approval') {
          icon = <Clock className="h-5 w-5 animate-pulse" />;
          bgColor = 'from-yellow-600 to-yellow-700';
          const approverMatch = log.details.match(/(Manager|Admin|Super Admin)/);
          details = (
            <div className="flex items-center gap-2 mt-2 text-sm bg-white/10 rounded p-2">
              <User className="h-4 w-4" />
              <div>
                <div className="font-semibold">Requires Approval:</div>
                <div className="text-xs opacity-90">{approverMatch ? approverMatch[1] : 'Approver'}</div>
              </div>
            </div>
          );
        } else if (log.nodeType === 'start') {
          icon = <CheckCircle className="h-5 w-5" />;
          bgColor = 'from-green-600 to-green-700';
          details = (
            <div className="flex items-center gap-2 mt-2 text-sm bg-white/10 rounded p-2">
              <Building className="h-4 w-4" />
              <div>
                <div className="font-semibold">Booking:</div>
                <div className="text-xs opacity-90">{booking?.facility} - {booking?.user.name}</div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={toast.id}
            className="animate-in slide-in-from-right duration-300 pointer-events-auto"
            style={{ animationFillMode: 'forwards' }}
          >
            <Card className={`bg-gradient-to-r ${bgColor} border-none shadow-2xl`}>
              <CardContent className="p-4 text-white relative">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold mb-1 text-base">{log.action}</div>
                    <div className="text-sm opacity-90 break-words">{log.details}</div>
                    {details}
                    <div className="flex items-center gap-2 mt-3 text-xs opacity-75 border-t border-white/20 pt-2">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{workflow?.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
