'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { WorkflowOverview } from '@/components/workflow/WorkflowOverview';
import { WorkflowsList } from '@/components/workflow/WorkflowsList';
import { ApprovalsQueue } from '@/components/workflow/ApprovalsQueue';
import { WorkflowDashboardContainer } from '@/components/workflow/WorkflowDashboardContainer';
import { IntegratedWorkflowBuilder } from '@/components/workflow/IntegratedWorkflowBuilder';

export default function WorkflowsPage() {
  const { currentUser } = useAppStore();

  if (!currentUser || currentUser.role === 'standard') {
    return (
      <div className="min-h-screen bg-[#001F3F] relative">
        <div className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")', zIndex: 0 }}
        />
        <div className="relative z-10">
          <Header />
          <div className="w-full mx-auto p-6">
            <div className="text-center py-12 bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Access Denied</h2>
              <p className="text-gray-300">Workflow management is only available to administrators.</p>
              <Link href="/dashboard">
                <Button className="mt-4 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] hover:from-[#00C5E6] hover:to-[#0086B3] text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001F3F] relative">
      <div className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")', zIndex: 0 }}
      />
      
      <div className="relative z-10">
        <Header />
        
        <div className="w-full mx-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-[#00D9FF] hover:bg-[#002850]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                <Workflow className="h-5 w-5 text-[#00D9FF]" />
                Workflows
              </h1>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <WorkflowDashboardContainer />
            </TabsContent>

            <TabsContent value="builder" className="mt-6">
              <IntegratedWorkflowBuilder />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <WorkflowOverview />
            </TabsContent>

            <TabsContent value="workflows" className="mt-6">
              <WorkflowsList />
            </TabsContent>

            <TabsContent value="approvals" className="mt-6">
              <ApprovalsQueue />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
