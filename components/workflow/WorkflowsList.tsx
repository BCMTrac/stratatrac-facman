'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Trash2, 
  Copy,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { workflowTemplates } from '@/lib/workflows/templates';
import { WorkflowTestRunner } from './WorkflowTestRunner';
import { WORKFLOW_PERMISSIONS } from '@/lib/permissions';

export function WorkflowsList() {
  const { workflows, addWorkflow, updateWorkflow, deleteWorkflow, facilities, currentUser } = useAppStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [testingWorkflowId, setTestingWorkflowId] = useState<string | null>(null);

  if (!currentUser) return null;

  const permissions = WORKFLOW_PERMISSIONS[currentUser.role];

  const loadTemplate = (template: typeof workflowTemplates[0]) => {
    if (!currentUser) return;
    
    addWorkflow({
      ...template,
      createdBy: currentUser.email
    });
  };

  const toggleWorkflow = (id: string, isActive: boolean) => {
    updateWorkflow(id, { isActive: !isActive });
  };

  const duplicateWorkflow = (workflow: any) => {
    if (!currentUser) return;
    
    addWorkflow({
      ...workflow,
      name: `${workflow.name} (Copy)`,
      createdBy: currentUser.email
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Saved Workflows</h3>
        <Button 
          onClick={() => setShowTemplates(!showTemplates)}
          variant="outline"
          className="border-[#00D9FF] text-[#00D9FF]"
        >
          {showTemplates ? 'Hide Templates' : 'Show Templates'}
        </Button>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Templates</h4>
          {workflowTemplates.map((template, idx) => (
            <Card key={idx} className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="bg-gradient-to-r from-[#00D9FF] to-[#0099CC]"
                  >
                    Load Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{template.nodes.length} nodes</span>
                  <span>{template.edges.length} connections</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Saved Workflows */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Your Workflows ({workflows.length})</h4>
        {workflows.length === 0 ? (
          <Card className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No workflows created yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create one in the Builder tab or load a template</p>
            </CardContent>
          </Card>
        ) : (
          workflows.map(workflow => (
            <Card key={workflow.id} className="bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-white text-lg">{workflow.name}</CardTitle>
                      <Badge className={workflow.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{workflow.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTestingWorkflowId(workflow.id)}
                      className="border-green-500 text-green-500"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                    {permissions.canEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleWorkflow(workflow.id, workflow.isActive)}
                        className="border-[#00D9FF] text-[#00D9FF]"
                      >
                        {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                    {permissions.canCreate && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateWorkflow(workflow)}
                        className="border-[#00D9FF] text-[#00D9FF]"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    {permissions.canDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Delete this workflow?')) {
                            deleteWorkflow(workflow.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                    <span className="text-gray-400 text-xs">Nodes</span>
                    <p className="font-bold text-white text-xl">{workflow.nodes.length}</p>
                  </div>
                  <div className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                    <span className="text-gray-400 text-xs">Connections</span>
                    <p className="font-bold text-white text-xl">{workflow.edges.length}</p>
                  </div>
                  <div className="bg-[#001F3F]/50 p-3 rounded-lg border border-[#00D9FF]/20">
                    <span className="text-gray-400 text-xs">Facilities</span>
                    <p className="font-bold text-white text-xl">{workflow.assignedFacilities.length}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-white text-xs mb-2 block">Assigned Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {workflow.assignedFacilities.length === 0 ? (
                      <span className="text-gray-500 text-sm">No facilities assigned</span>
                    ) : (
                      workflow.assignedFacilities.map(facId => (
                        <Badge key={facId} variant="outline" className="border-[#00D9FF] text-[#00D9FF]">
                          {facId}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Created: {new Date(workflow.createdAt).toLocaleDateString()}
                  {' '} by {workflow.createdBy}
                </div>
              </CardContent>
              
              {/* Test Runner */}
              {testingWorkflowId === workflow.id && (
                <CardContent className="pt-0">
                  <WorkflowTestRunner workflowId={workflow.id} />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTestingWorkflowId(null)}
                    className="w-full mt-3"
                  >
                    Close Test
                  </Button>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
