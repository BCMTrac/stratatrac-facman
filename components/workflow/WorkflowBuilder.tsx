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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Save, 
  Trash2, 
  Plus,
  GitBranch,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  X
} from 'lucide-react';

// Start Node Component
function StartNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-green-50">
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <Play className="h-5 w-5 text-green-600" />
        <div>
          <div className="font-bold text-green-900">Start</div>
          <div className="text-xs text-green-700">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

// Status Change Node
function StatusNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-blue-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-blue-600" />
        <div className="font-bold text-blue-900">Change Status</div>
      </div>
      <div className="text-sm text-blue-800">
        <strong>To:</strong> {data.targetStatus || 'Not set'}
      </div>
    </div>
  );
}

// Approval Node
function ApprovalNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-yellow-500 bg-yellow-50 min-w-[200px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-5 w-5 text-yellow-600" />
        <div className="font-bold text-yellow-900">Approval Required</div>
      </div>
      <div className="text-sm text-yellow-800 space-y-1">
        <div><strong>Level:</strong> {data.approvalLevel || 'Manager'}</div>
        <div><strong>Timeout:</strong> {data.timeout || '24'}h</div>
      </div>
    </div>
  );
}

// Notification Node
function NotificationNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-purple-500 bg-purple-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5 text-purple-600" />
        <div className="font-bold text-purple-900">Send Notification</div>
      </div>
      <div className="text-sm text-purple-800">
        <div><strong>Type:</strong> {data.notificationType || 'Email + SMS'}</div>
      </div>
    </div>
  );
}

// Condition Node
function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-orange-500 bg-orange-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="true" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '70%' }} />
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-5 w-5 text-orange-600" />
        <div className="font-bold text-orange-900">Condition</div>
      </div>
      <div className="text-sm text-orange-800">
        {data.condition || 'No condition set'}
      </div>
    </div>
  );
}

// End Node
function EndNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-red-500 bg-red-50">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <XCircle className="h-5 w-5 text-red-600" />
        <div>
          <div className="font-bold text-red-900">End</div>
          <div className="text-xs text-red-700">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

// Initial nodes for a simple workflow
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Booking Created' },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'notification',
    data: { notificationType: 'Email + SMS' },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'status',
    data: { targetStatus: 'Pending' },
    position: { x: 250, y: 250 },
  },
  {
    id: '4',
    type: 'approval',
    data: { approvalLevel: 'Manager', timeout: '24' },
    position: { x: 250, y: 350 },
  },
  {
    id: '5',
    type: 'status',
    data: { targetStatus: 'Confirmed' },
    position: { x: 250, y: 480 },
  },
  {
    id: '6',
    type: 'end',
    data: { label: 'Complete' },
    position: { x: 250, y: 580 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', target: '5', label: 'Approved', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

interface WorkflowBuilderProps {
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

export function WorkflowBuilder({ onSave }: WorkflowBuilderProps) {
  const { currentUser, addWorkflow, workflows } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('My Custom Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Use useMemo to define nodeTypes after components are defined - fixes hydration error
  const nodeTypes = useMemo(() => ({
    start: StartNode,
    status: StatusNode,
    approval: ApprovalNode,
    notification: NotificationNode,
    condition: ConditionNode,
    end: EndNode,
  }), []);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      data: { label: `New ${type} node` },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    
    if (onSave) {
      onSave(nodes, edges);
    }
    
    addWorkflow({
      name: workflowName,
      description: workflowDescription || 'Custom workflow',
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
    
    alert(`Workflow "${workflowName}" saved successfully!`);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-2">
      {/* Left Sidebar - Node Palette */}
      <Card className="w-44 bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30 overflow-y-auto flex-shrink-0">
        <CardHeader className="py-3 px-3">
          <CardTitle className="text-white text-xs">Nodes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-3 pb-3">
          <Button onClick={() => addNode('start')} className="w-full justify-start gap-1 bg-green-600 hover:bg-green-700 h-8 text-xs" size="sm">
            <Play className="h-3 w-3" /> Start
          </Button>
          <Button onClick={() => addNode('status')} className="w-full justify-start gap-1 bg-blue-600 hover:bg-blue-700 h-8 text-xs" size="sm">
            <Zap className="h-3 w-3" /> Status
          </Button>
          <Button onClick={() => addNode('approval')} className="w-full justify-start gap-1 bg-yellow-600 hover:bg-yellow-700 h-8 text-xs" size="sm">
            <CheckCircle className="h-3 w-3" /> Approval
          </Button>
          <Button onClick={() => addNode('notification')} className="w-full justify-start gap-1 bg-purple-600 hover:bg-purple-700 h-8 text-xs" size="sm">
            <Mail className="h-3 w-3" /> Notify
          </Button>
          <Button onClick={() => addNode('condition')} className="w-full justify-start gap-1 bg-orange-600 hover:bg-orange-700 h-8 text-xs" size="sm">
            <GitBranch className="h-3 w-3" /> Condition
          </Button>
          <Button onClick={() => addNode('end')} className="w-full justify-start gap-1 bg-red-600 hover:bg-red-700 h-8 text-xs" size="sm">
            <XCircle className="h-3 w-3" /> End
          </Button>

          <Separator className="my-2 bg-[#00D9FF]/20" />
          <Button onClick={handleSave} className="w-full gap-1 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#001F3F] font-bold h-8 text-xs">
            <Save className="h-3 w-3" /> Save
          </Button>
          {selectedNode && (
            <Button onClick={deleteSelectedNode} variant="destructive" className="w-full gap-1 h-8 text-xs" size="sm">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Main Canvas */}
      <div className="flex-1 bg-[#002850]/90 backdrop-blur-sm border border-[#00D9FF]/30 rounded-lg overflow-hidden relative">
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
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'start': return '#22c55e';
                case 'status': return '#3b82f6';
                case 'approval': return '#eab308';
                case 'notification': return '#a855f7';
                case 'condition': return '#f97316';
                case 'end': return '#ef4444';
                default: return '#6b7280';
              }
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Floating Properties Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-72 bg-[#002850]/95 backdrop-blur-sm border border-[#00D9FF]/50 rounded-lg shadow-2xl z-10 max-h-[calc(100%-2rem)] overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-xs font-bold">Properties</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)} className="h-6 w-6 p-0 text-gray-400 hover:text-white">
              <X className="h-3 w-3" />
            </Button>
          </div>
            <div className="space-y-3">
              <div>
                <Badge className="text-xs">{selectedNode.type}</Badge>
              </div>
              
              <div className="text-xs text-gray-400">ID: {selectedNode.id}</div>

              {selectedNode.type === 'status' && (
                <div>
                  <Label className="text-white text-xs">Status</Label>
                  <Select defaultValue="pending">
                    <SelectTrigger className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNode.type === 'approval' && (
                <>
                  <div>
                    <Label className="text-white text-xs">Level</Label>
                    <Select defaultValue="manager">
                      <SelectTrigger className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white text-xs">Timeout</Label>
                    <Input type="number" defaultValue="24" className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs" />
                  </div>
                </>
              )}

              {selectedNode.type === 'notification' && (
                <div>
                  <Label className="text-white text-xs">Type</Label>
                  <Select defaultValue="both">
                    <SelectTrigger className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="both">Email + SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNode.type === 'condition' && (
                <>
                  <div>
                    <Label className="text-white text-xs">Field</Label>
                    <Input placeholder="e.g., depositAmount" className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs" />
                  </div>
                  <div>
                    <Label className="text-white text-xs">Operator</Label>
                    <Select defaultValue="greater_than">
                      <SelectTrigger className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white text-xs">Value</Label>
                    <Input placeholder="e.g., 500" className="mt-1 bg-[#001F3F] border-[#00D9FF]/30 text-white h-8 text-xs" />
                  </div>
                </>
              )}
            </div>
        </div>
        </div>
      )}
    </div>
  );
}
