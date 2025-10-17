'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Zap, 
  TrendingUp,
  GitBranch,
  Mail,
  CheckCircle
} from 'lucide-react';

export function WorkflowOverview() {
  const { workflows, workflowExecutions, bookings } = useAppStore();

  const activeWorkflows = workflows.filter(w => w.isActive).length;
  const totalExecutions = workflowExecutions.length;
  const pendingApprovals = bookings.filter(b => b.status === 'pending').length;
  const autoApproved = workflowExecutions.filter(e => 
    e.status === 'completed' && 
    e.executionLog.some(log => log.action.includes('Auto'))
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{activeWorkflows}</div>
            <p className="text-xs text-gray-400 mt-1">Deployed workflows</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-400">{pendingApprovals}</div>
            <p className="text-xs text-gray-400 mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-400">{totalExecutions}</div>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Auto-Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-400">{autoApproved}</div>
            <p className="text-xs text-gray-400 mt-1">Automated</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
          <CardHeader>
            <CardTitle className="text-white">Workflow Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <GitBranch className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Multi-Stage Approvals</p>
                <p className="text-sm text-gray-300">Configure manager, admin, and super admin approval chains</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg flex-shrink-0">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Conditional Logic</p>
                <p className="text-sm text-gray-300">Branch workflows based on booking details and conditions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <Mail className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Automated Communications</p>
                <p className="text-sm text-gray-300">Send emails and SMS at each workflow stage</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Status Management</p>
                <p className="text-sm text-gray-300">Automatically update booking statuses through workflow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
          <CardHeader>
            <CardTitle className="text-white">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            {workflowExecutions.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No workflow executions yet</p>
                <p className="text-gray-500 text-sm mt-1">Workflows will execute when bookings are created</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workflowExecutions.slice(-5).reverse().map(execution => {
                  const workflow = workflows.find(w => w.id === execution.workflowId);
                  const booking = bookings.find(b => b.id === execution.bookingId);
                  
                  return (
                    <div key={execution.id} className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm">
                          {workflow?.name || 'Unknown Workflow'}
                        </span>
                        <Badge className={
                          execution.status === 'completed' ? 'bg-green-500' :
                          execution.status === 'running' ? 'bg-blue-500' :
                          'bg-red-500'
                        }>
                          {execution.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">
                        Booking: {booking?.facility || 'Unknown'} ({execution.bookingId})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(execution.startedAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/30 hover:border-[#00D9FF] transition-colors text-left">
              <GitBranch className="h-8 w-8 text-[#00D9FF] mb-2" />
              <p className="font-semibold text-white">Create Workflow</p>
              <p className="text-xs text-gray-400 mt-1">Build custom workflow</p>
            </button>

            <button className="p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/30 hover:border-[#00D9FF] transition-colors text-left">
              <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
              <p className="font-semibold text-white">View Analytics</p>
              <p className="text-xs text-gray-400 mt-1">Workflow performance</p>
            </button>

            <button className="p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/30 hover:border-[#00D9FF] transition-colors text-left">
              <Activity className="h-8 w-8 text-purple-400 mb-2" />
              <p className="font-semibold text-white">Execution Log</p>
              <p className="text-xs text-gray-400 mt-1">View all executions</p>
            </button>

            <button className="p-4 bg-[#001F3F]/50 rounded-lg border border-[#00D9FF]/30 hover:border-[#00D9FF] transition-colors text-left">
              <CheckCircle className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="font-semibold text-white">Approvals Queue</p>
              <p className="text-xs text-gray-400 mt-1">{pendingApprovals} pending</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
