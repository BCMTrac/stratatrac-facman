'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppStore } from '@/lib/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Save, Trash2, GitBranch, Mail, CheckCircle, XCircle, Zap, X, Loader2, Plus
} from 'lucide-react';
import { workflowTemplates } from '@/lib/workflows/templates';
import { toast } from 'sonner';

// Simple node components
function StartNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-green-500'} bg-green-50 min-w-[150px]`}>
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <Play className="h-5 w-5 text-green-600" />
        <div className="font-bold text-green-900">{data.title || 'Start'}</div>
      </div>
    </div>
  );
}

function StatusNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-blue-500'} bg-blue-50 min-w-[150px]`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <Zap className="h-5 w-5 text-blue-600" />
        <div className="font-bold text-blue-900">{data.title || 'Status'}</div>
      </div>
    </div>
  );
}

function ApprovalNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-yellow-500'} bg-yellow-50 min-w-[150px]`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <CheckCircle className="h-5 w-5 text-yellow-600" />
        <div className="font-bold text-yellow-900">{data.title || 'Approval'}</div>
      </div>
    </div>
  );
}

function NotificationNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-purple-500'} bg-purple-50 min-w-[150px]`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <Mail className="h-5 w-5 text-purple-600" />
        <div className="font-bold text-purple-900">{data.title || 'Notification'}</div>
      </div>
    </div>
  );
}

function ConditionNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-orange-500'} bg-orange-50 min-w-[150px]`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <GitBranch className="h-5 w-5 text-orange-600" />
        <div className="font-bold text-orange-900">{data.title || 'Condition'}</div>
      </div>
    </div>
  );
}

function EndNode({ data, id }: any) {
  const { workflowExecutions } = useAppStore();
  const activeExecution = workflowExecutions.find(e => e.status === 'running');
  const isExecuting = activeExecution?.currentNodeId === id;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 ${isExecuting ? 'border-yellow-400 animate-pulse' : 'border-red-500'} bg-red-50 min-w-[150px]`}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        <XCircle className="h-5 w-5 text-red-600" />
        <div className="font-bold text-red-900">{data.title || 'End'}</div>
      </div>
    </div>
  );
}

export function IntegratedWorkflowBuilder() {
  const { currentUser, addWorkflow, workflows, bookings, workflowExecutions, executeWorkflow } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  const nodeTypes = useMemo(() => ({
    start: StartNode,
    status: StatusNode,
    approval: ApprovalNode,
    notification: NotificationNode,
    condition: ConditionNode,
    end: EndNode,
  }), []);

  const activeExecution = workflowExecutions.find(e => e.status === 'running');

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Add node
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      data: { title: type.charAt(0).toUpperCase() + type.slice(1) },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`${type} node added`);
  };

  // Delete node
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      toast.success('Node deleted');
    }
  };

  // Save workflow
  const handleSave = () => {
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }
    if (nodes.length === 0) {
      toast.error('Add some nodes first');
      return;
    }
    
    addWorkflow({
      name: workflowName,
      description: 'Custom workflow',
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type as any,
        data: n.data,
        position: n.position
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.animated
      })),
      assignedFacilities: [],
      isActive: true,
      createdBy: currentUser.email
    });
    
    toast.success(`Workflow "${workflowName}" saved!`);
  };

  // Load template
  const loadTemplate = (index: number) => {
    const template = workflowTemplates[index];
    setNodes(template.nodes.map(n => ({ ...n, data: { title: n.type } })));
    setEdges(template.edges.map(e => ({ ...e, animated: true, markerEnd: { type: MarkerType.ArrowClosed } })));
    setWorkflowName(template.name);
    toast.success(`Loaded: ${template.name}`);
  };

  // Initialize workflows
  const handleInitialize = () => {
    if (!currentUser) return;
    workflowTemplates.forEach(template => {
      addWorkflow({
        ...template,
        createdBy: currentUser.email
      });
    });
    toast.success('3 template workflows created!');
  };

  // Run workflow
  const handleRun = (workflowId: string) => {
    if (!selectedBookingId) {
      toast.error('Select a booking first');
      return;
    }
    executeWorkflow(workflowId, selectedBookingId);
    toast.success('Workflow started!');
  };

  return (
    <div className="grid grid-cols-[1fr_350px] gap-4 h-[calc(100vh-200px)]">
      {/* Canvas */}
      <div className="flex flex-col gap-4">
        {/* Execution Banner */}
        {activeExecution && (
          <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-2 border-blue-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  <div className="text-white font-bold">Workflow Running...</div>
                </div>
                <Badge className="bg-blue-500">{activeExecution.executionLog.length} steps</Badge>
              </div>
              <Progress value={(activeExecution.executionLog.length / 6) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        )}

        {/* Canvas */}
        <div className="flex-1 bg-[#002850]/90 border border-[#00D9FF]/30 rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-4 overflow-y-auto">
        {/* Templates */}
        <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => loadTemplate(0)} size="sm" variant="outline" className="w-full text-xs justify-start">
              Simple Approval
            </Button>
            <Button onClick={() => loadTemplate(1)} size="sm" variant="outline" className="w-full text-xs justify-start">
              Auto-Confirm
            </Button>
            <Button onClick={() => loadTemplate(2)} size="sm" variant="outline" className="w-full text-xs justify-start">
              Complex Approval
            </Button>
          </CardContent>
        </Card>

        {/* Test Section */}
        <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Test Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
              <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white text-xs">
                <SelectValue placeholder="Select booking..." />
              </SelectTrigger>
              <SelectContent>
                {bookings.slice(0, 10).map(b => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.facility} - {b.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {workflows.length === 0 ? (
              <Button onClick={handleInitialize} className="w-full bg-[#00D9FF] text-[#001F3F] text-xs">
                <Plus className="h-3 w-3 mr-2" /> Create Workflows
              </Button>
            ) : (
              <div className="space-y-2">
                {workflows.map(wf => (
                  <Button
                    key={wf.id}
                    onClick={() => handleRun(wf.id)}
                    disabled={!selectedBookingId}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-9"
                  >
                    <Play className="h-4 w-4 mr-2" /> RUN {wf.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Nodes */}
        <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Add Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Button onClick={() => addNode('start')} className="w-full bg-green-600 hover:bg-green-700 text-xs h-7" size="sm">
              <Play className="h-3 w-3 mr-1" /> Start
            </Button>
            <Button onClick={() => addNode('status')} className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-7" size="sm">
              <Zap className="h-3 w-3 mr-1" /> Status
            </Button>
            <Button onClick={() => addNode('approval')} className="w-full bg-yellow-600 hover:bg-yellow-700 text-xs h-7" size="sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Approval
            </Button>
            <Button onClick={() => addNode('notification')} className="w-full bg-purple-600 hover:bg-purple-700 text-xs h-7" size="sm">
              <Mail className="h-3 w-3 mr-1" /> Notify
            </Button>
            <Button onClick={() => addNode('condition')} className="w-full bg-orange-600 hover:bg-orange-700 text-xs h-7" size="sm">
              <GitBranch className="h-3 w-3 mr-1" /> Condition
            </Button>
            <Button onClick={() => addNode('end')} className="w-full bg-red-600 hover:bg-red-700 text-xs h-7" size="sm">
              <XCircle className="h-3 w-3 mr-1" /> End
            </Button>
          </CardContent>
        </Card>

        {/* Save */}
        <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
          <CardContent className="p-4 space-y-2">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Workflow name"
              className="bg-[#001F3F] border-[#00D9FF]/30 text-white text-xs h-8"
            />
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold text-xs h-9">
              <Save className="h-4 w-4 mr-2" /> Save Workflow
            </Button>
            {selectedNode && (
              <Button onClick={deleteSelectedNode} variant="destructive" className="w-full text-xs h-8">
                <Trash2 className="h-3 w-3 mr-2" /> Delete Selected
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
