'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Zap } from 'lucide-react';

/**
 * Workflow Toast Notifier
 * Shows visual toasts when workflows execute
 */
export function WorkflowToastNotifier() {
  const { workflowExecutions, workflows } = useAppStore();

  useEffect(() => {
    if (workflowExecutions.length === 0) return;

    const latestExecution = workflowExecutions[workflowExecutions.length - 1];
    const workflow = workflows.find(w => w.id === latestExecution.workflowId);

    // Show toast when execution completes
    if (latestExecution.status === 'completed') {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-semibold">Workflow Completed</p>
            <p className="text-sm text-gray-600">{workflow?.name}</p>
          </div>
        </div>,
        {
          duration: 3000,
        }
      );
    } else if (latestExecution.status === 'failed') {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <div>
            <p className="font-semibold">Workflow Failed</p>
            <p className="text-sm text-gray-600">{workflow?.name}</p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
    }
  }, [workflowExecutions, workflows]);

  return null; // This component doesn't render anything
}
