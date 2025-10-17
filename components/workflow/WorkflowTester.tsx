'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  ChevronDown,
  ChevronRight,
  Plus,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WorkflowExecution, WorkflowExecutionLogEntry } from '@/lib/types';
import { workflowTemplates } from '@/lib/workflows/templates';
import { toast } from 'sonner';

export function WorkflowTester() {
  const { bookings, workflows, workflowExecutions, executeWorkflow, addWorkflow, currentUser } = useAppStore();
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [activeExecution, setActiveExecution] = useState<WorkflowExecution | null>(null);
  const [liveLogIndex, setLiveLogIndex] = useState(0);

  // Watch for new executions and animate them
  useEffect(() => {
    if (workflowExecutions.length > 0) {
      const latest = workflowExecutions[workflowExecutions.length - 1];
      if (latest.status === 'running') {
        setActiveExecution(latest);
        setLiveLogIndex(0);
        setExpandedExecution(latest.id);
      } else if (activeExecution?.id === latest.id && latest.status !== 'running') {
        // Execution completed
        setTimeout(() => setActiveExecution(null), 2000);
      }
    }
  }, [workflowExecutions]);

  // Animate log entries appearing
  useEffect(() => {
    if (activeExecution && liveLogIndex < activeExecution.executionLog.length) {
      const timer = setTimeout(() => {
        setLiveLogIndex(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeExecution, liveLogIndex]);

  const handleLoadTemplates = () => {
    if (!currentUser) return;
    
    setIsLoadingTemplates(true);
    workflowTemplates.forEach(template => {
      addWorkflow({
        ...template,
        createdBy: currentUser.email
      });
    });
    setIsLoadingTemplates(false);
    toast.success('Template workflows loaded successfully!');
  };

  const handleTestWorkflow = (workflowId: string) => {
    console.log('[WorkflowTester] Test button clicked for workflow:', workflowId);
    const testBooking = bookings[0];
    console.log('[WorkflowTester] Test booking:', testBooking);
    
    if (!testBooking) {
      console.error('[WorkflowTester] No bookings available');
      toast.error('No bookings available for testing. Create a booking first.');
      return;
    }

    console.log('[WorkflowTester] Calling executeWorkflow...');
    executeWorkflow(workflowId, testBooking.id);
    toast.success(`Executing workflow...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateProgress = (execution: WorkflowExecution) => {
    const workflow = workflows.find(w => w.id === execution.workflowId);
    if (!workflow) return 0;
    const totalNodes = workflow.nodes.length;
    const completedNodes = execution.executionLog.length;
    return Math.min((completedNodes / totalNodes) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Live Execution Viewer - Only shows when workflow is running */}
      {activeExecution && (
        <Card className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-sm border-2 border-blue-400 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    Workflow Executing...
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    {workflows.find(w => w.id === activeExecution.workflowId)?.name}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-500 text-white text-sm px-4 py-1">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Running
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-blue-200">
                <span>Progress</span>
                <span>{Math.round(calculateProgress(activeExecution))}%</span>
              </div>
              <Progress 
                value={calculateProgress(activeExecution)} 
                className="h-2 bg-blue-900"
              />
            </div>

            {/* Live Log Entries */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeExecution.executionLog.slice(0, liveLogIndex).map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-950/50 rounded-lg border border-blue-700/30 animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {log.result === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0 animate-in zoom-in duration-300" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{log.action}</span>
                      <ArrowRight className="h-3 w-3 text-blue-400" />
                      <Badge variant="outline" className="text-xs border-blue-500 text-blue-200">
                        {log.nodeType}
                      </Badge>
                    </div>
                    <p className="text-blue-300 text-sm">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow List */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Available Workflows</CardTitle>
              <CardDescription className="text-gray-300">
                Click "Test" to run a workflow on the latest booking
              </CardDescription>
            </div>
            {workflows.length === 0 && (
              <Button
                onClick={handleLoadTemplates}
                disabled={isLoadingTemplates}
                className="gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold"
              >
                <Plus className="h-4 w-4" />
                Load Templates
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {workflows.length === 0 ? (
            <div className="text-center py-8 border border-[#00D9FF]/20 rounded-lg bg-[#001F3F]/50">
              <Zap className="h-12 w-12 text-[#00D9FF] mx-auto mb-3" />
              <p className="text-gray-300 mb-2">No workflows created yet</p>
              <p className="text-gray-400 text-sm mb-4">
                Load template workflows or create your own in the Builder tab
              </p>
              <Button
                onClick={handleLoadTemplates}
                disabled={isLoadingTemplates}
                className="gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold"
              >
                <Plus className="h-4 w-4" />
                Load Template Workflows
              </Button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-4 bg-[#001F3F] border border-[#00D9FF]/20 rounded-lg hover:border-[#00D9FF]/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{workflow.name}</h3>
                    <Badge variant={workflow.isActive ? 'default' : 'secondary'} className="text-xs">
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{workflow.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs text-gray-300">
                      {workflow.nodes.length} nodes
                    </Badge>
                    <Badge variant="outline" className="text-xs text-gray-300">
                      {workflow.edges.length} connections
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleTestWorkflow(workflow.id)}
                  size="sm"
                  disabled={!workflow.isActive || bookings.length === 0}
                  className="gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Play className="h-4 w-4" />
                  Test
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white">Execution History</CardTitle>
          <CardDescription className="text-gray-300">
            Recent workflow executions and their results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {workflowExecutions.length === 0 ? (
            <div className="text-center py-8 border border-[#00D9FF]/20 rounded-lg bg-[#001F3F]/50">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No executions yet</p>
              <p className="text-gray-500 text-xs mt-1">Test a workflow to see results here</p>
            </div>
          ) : (
            workflowExecutions.slice().reverse().map((execution) => {
              const workflow = workflows.find(w => w.id === execution.workflowId);
              const booking = bookings.find(b => b.id === execution.bookingId);
              const isExpanded = expandedExecution === execution.id;
              const progress = calculateProgress(execution);

              return (
                <div
                  key={execution.id}
                  className="border border-[#00D9FF]/20 rounded-lg overflow-hidden hover:border-[#00D9FF]/50 transition-all"
                >
                  {/* Execution Summary */}
                  <div
                    className="flex items-center justify-between p-4 bg-[#001F3F] cursor-pointer hover:bg-[#001F3F]/80 transition-colors"
                    onClick={() => setExpandedExecution(isExpanded ? null : execution.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(execution.status)}
                        <h4 className="text-white font-medium">
                          {workflow?.name || 'Unknown Workflow'}
                        </h4>
                        <Badge className={`${getStatusColor(execution.status)} text-white text-xs`}>
                          {execution.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        Booking: {booking?.facility || 'Unknown'} • {new Date(execution.startedAt).toLocaleString()}
                      </p>
                      {/* Mini Progress Bar */}
                      <Progress value={progress} className="h-1" />
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 ml-4" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                    )}
                  </div>

                  {/* Execution Details */}
                  {isExpanded && (
                    <div className="p-4 bg-[#001F3F]/50 border-t border-[#00D9FF]/20">
                      <div className="space-y-2">
                        {execution.executionLog.map((log, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-[#002850] rounded border border-[#00D9FF]/10"
                          >
                            {log.result === 'success' ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium">{log.action}</span>
                                <Badge variant="outline" className="text-xs">
                                  {log.nodeType}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm">{log.details}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {execution.completedAt && (
                        <div className="mt-4 pt-3 border-t border-[#00D9FF]/20 flex justify-between text-sm">
                          <span className="text-gray-400">
                            Duration: {Math.round(
                              (new Date(execution.completedAt).getTime() - 
                               new Date(execution.startedAt).getTime()) / 1000
                            )}s
                          </span>
                          <span className="text-gray-400">
                            {execution.executionLog.length} steps completed
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all">
              <div className="text-3xl font-bold text-white mb-1">{workflows.length}</div>
              <div className="text-xs text-gray-400">Total Workflows</div>
            </div>
            <div className="text-center p-4 bg-[#001F3F]/50 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all">
              <div className="text-3xl font-bold text-blue-400 mb-1">{workflowExecutions.filter(e => e.status === 'running').length}</div>
              <div className="text-xs text-gray-400">Running</div>
            </div>
            <div className="text-center p-4 bg-[#001F3F]/50 rounded-lg border border-green-500/20 hover:border-green-500/50 transition-all">
              <div className="text-3xl font-bold text-green-400 mb-1">{workflowExecutions.filter(e => e.status === 'completed').length}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-[#001F3F]/50 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all">
              <div className="text-3xl font-bold text-red-400 mb-1">{workflowExecutions.filter(e => e.status === 'failed').length}</div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
