'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  UserCheck,
  Plus,
  Settings
} from 'lucide-react';

interface WorkflowManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowManagementModal({ isOpen, onClose }: WorkflowManagementModalProps) {
  const { currentUser } = useAppStore();

  if (!currentUser || currentUser.role === 'standard') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Workflow className="h-6 w-6" />
            Workflow Management
          </DialogTitle>
          <DialogDescription>
            Configure approval workflows, status transitions, and automated communications
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Deployed workflows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">5</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Auto-Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">12</div>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Features</CardTitle>
                <CardDescription>What you can do with the workflow engine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <GitBranch className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Multi-Stage Approvals</p>
                    <p className="text-sm text-muted-foreground">Configure manager, admin, and super admin approval chains</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Conditional Logic</p>
                    <p className="text-sm text-muted-foreground">Auto-approve based on deposit amount, user role, or facility type</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Automated Communications</p>
                    <p className="text-sm text-muted-foreground">Send emails and SMS at each workflow stage</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Role-Based Actions</p>
                    <p className="text-sm text-muted-foreground">Different workflows for different user levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab - Continued in next response due to length */}
          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Workflows</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Simple Booking Approval</CardTitle>
                    <CardDescription>Basic 1-stage approval for facility bookings</CardDescription>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stages:</span>
                    <span className="font-medium">4 steps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approval Level:</span>
                    <span className="font-medium">Manager</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeout:</span>
                    <span className="font-medium">24 hours</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals & Builder tabs similar structure */}
           <TabsContent value="approvals" className="space-y-4">
            <p className="text-muted-foreground">Approval queue coming soon...</p>
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <Card className="border-2 border-dashed">
              <CardContent className="pt-6 text-center">
                <Workflow className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Visual Workflow Builder</h3>
                <p className="text-muted-foreground">Coming soon with React Flow integration</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
