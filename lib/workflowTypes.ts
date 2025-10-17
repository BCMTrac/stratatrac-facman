// Workflow Engine Types

export type WorkflowNodeType = 
  | 'start' 
  | 'status_change' 
  | 'approval' 
  | 'notification' 
  | 'condition' 
  | 'action'
  | 'end';

export type ApprovalLevel = 'manager' | 'admin' | 'super_admin';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: {
    // For status_change nodes
    targetStatus?: string;
    
    // For approval nodes
    approvalLevel?: ApprovalLevel;
    requiredApprovers?: number;
    timeoutHours?: number;
    
    // For notification nodes
    notificationType?: 'email' | 'sms' | 'both';
    recipients?: string[]; // 'user', 'admin', 'custom'
    template?: string;
    
    // For condition nodes
    condition?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
      value: string | number;
    };
    
    // For action nodes
    actionType?: 'update_field' | 'create_task' | 'send_webhook';
    actionConfig?: Record<string, unknown>;
  };
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  source: string; // source node id
  target: string; // target node id
  label?: string; // for conditional branches
  condition?: string; // condition expression
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string; // 'booking', 'move_request', 'maintenance'
  version: number;
  isActive: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityType: 'booking' | 'move_request';
  entityId: string;
  currentNodeId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  variables: Record<string, unknown>;
  history: WorkflowHistoryEntry[];
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowHistoryEntry {
  id: string;
  nodeId: string;
  nodeName: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ApprovalRequest {
  id: string;
  workflowInstanceId: string;
  nodeId: string;
  entityType: 'booking' | 'move_request';
  entityId: string;
  requestedBy: string;
  requiredLevel: ApprovalLevel;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvers: ApprovalAction[];
  createdAt: string;
  expiresAt?: string;
  resolvedAt?: string;
}

export interface ApprovalAction {
  id: string;
  approverId: string;
  approverName: string;
  action: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
}

// Predefined workflow templates
export const WORKFLOW_TEMPLATES = {
  SIMPLE_BOOKING: {
    name: 'Simple Booking Approval',
    description: 'Basic approval workflow for facility bookings',
    nodes: [
      {
        id: 'start',
        type: 'start' as WorkflowNodeType,
        label: 'Booking Created',
        config: {},
        position: { x: 100, y: 100 }
      },
      {
        id: 'notify_user',
        type: 'notification' as WorkflowNodeType,
        label: 'Notify User',
        config: {
          notificationType: 'both' as const,
          recipients: ['user'],
          template: 'booking_created'
        },
        position: { x: 100, y: 200 }
      },
      {
        id: 'pending',
        type: 'status_change' as WorkflowNodeType,
        label: 'Set to Pending',
        config: {
          targetStatus: 'pending'
        },
        position: { x: 100, y: 300 }
      },
      {
        id: 'approval',
        type: 'approval' as WorkflowNodeType,
        label: 'Manager Approval',
        config: {
          approvalLevel: 'manager' as ApprovalLevel,
          requiredApprovers: 1,
          timeoutHours: 24
        },
        position: { x: 100, y: 400 }
      },
      {
        id: 'confirmed',
        type: 'status_change' as WorkflowNodeType,
        label: 'Confirm Booking',
        config: {
          targetStatus: 'confirmed'
        },
        position: { x: 100, y: 500 }
      },
      {
        id: 'notify_confirmed',
        type: 'notification' as WorkflowNodeType,
        label: 'Send Confirmation',
        config: {
          notificationType: 'both' as const,
          recipients: ['user'],
          template: 'booking_confirmed'
        },
        position: { x: 100, y: 600 }
      },
      {
        id: 'end',
        type: 'end' as WorkflowNodeType,
        label: 'Complete',
        config: {},
        position: { x: 100, y: 700 }
      }
    ],
    connections: [
      { id: 'c1', source: 'start', target: 'notify_user' },
      { id: 'c2', source: 'notify_user', target: 'pending' },
      { id: 'c3', source: 'pending', target: 'approval' },
      { id: 'c4', source: 'approval', target: 'confirmed', label: 'Approved' },
      { id: 'c5', source: 'confirmed', target: 'notify_confirmed' },
      { id: 'c6', source: 'notify_confirmed', target: 'end' }
    ]
  },
  
  COMPLEX_MOVE_REQUEST: {
    name: 'Move Request with Multi-Level Approval',
    description: 'Complex workflow for move in/out requests with multiple approval stages',
    nodes: [
      {
        id: 'start',
        type: 'start' as WorkflowNodeType,
        label: 'Move Request Created',
        config: {},
        position: { x: 100, y: 100 }
      },
      {
        id: 'check_deposit',
        type: 'condition' as WorkflowNodeType,
        label: 'Check Deposit Amount',
        config: {
          condition: {
            field: 'depositAmount',
            operator: 'greater_than',
            value: 500
          }
        },
        position: { x: 100, y: 200 }
      },
      {
        id: 'manager_approval',
        type: 'approval' as WorkflowNodeType,
        label: 'Manager Approval',
        config: {
          approvalLevel: 'manager' as ApprovalLevel,
          requiredApprovers: 1,
          timeoutHours: 48
        },
        position: { x: 300, y: 300 }
      },
      {
        id: 'admin_approval',
        type: 'approval' as WorkflowNodeType,
        label: 'Admin Approval',
        config: {
          approvalLevel: 'admin' as ApprovalLevel,
          requiredApprovers: 1,
          timeoutHours: 24
        },
        position: { x: 300, y: 400 }
      },
      {
        id: 'auto_approve',
        type: 'status_change' as WorkflowNodeType,
        label: 'Auto Approve',
        config: {
          targetStatus: 'confirmed'
        },
        position: { x: 100, y: 300 }
      },
      {
        id: 'confirmed',
        type: 'status_change' as WorkflowNodeType,
        label: 'Confirm Move',
        config: {
          targetStatus: 'confirmed'
        },
        position: { x: 300, y: 500 }
      },
      {
        id: 'notify_all',
        type: 'notification' as WorkflowNodeType,
        label: 'Notify All Parties',
        config: {
          notificationType: 'both' as const,
          recipients: ['user', 'admin'],
          template: 'move_confirmed'
        },
        position: { x: 200, y: 600 }
      },
      {
        id: 'end',
        type: 'end' as WorkflowNodeType,
        label: 'Complete',
        config: {},
        position: { x: 200, y: 700 }
      }
    ],
    connections: [
      { id: 'c1', source: 'start', target: 'check_deposit' },
      { id: 'c2', source: 'check_deposit', target: 'manager_approval', label: '> $500' },
      { id: 'c3', source: 'check_deposit', target: 'auto_approve', label: '<= $500' },
      { id: 'c4', source: 'manager_approval', target: 'admin_approval', label: 'Approved' },
      { id: 'c5', source: 'admin_approval', target: 'confirmed', label: 'Approved' },
      { id: 'c6', source: 'auto_approve', target: 'notify_all' },
      { id: 'c7', source: 'confirmed', target: 'notify_all' },
      { id: 'c8', source: 'notify_all', target: 'end' }
    ]
  }
};
