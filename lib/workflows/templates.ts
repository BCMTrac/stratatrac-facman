import { WorkflowDefinition } from '../types';

export const workflowTemplates: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
    name: 'Simple Approval',
    description: 'Basic workflow: Booking → Notification → Approval → Confirmed',
    isActive: true,
    assignedFacilities: [],
    nodes: [
      {
        id: '1',
        type: 'start',
        data: { label: 'Booking Created' },
        position: { x: 250, y: 50 },
      },
      {
        id: '2',
        type: 'notification',
        data: { notificationType: 'Email + SMS', message: 'New booking received' },
        position: { x: 250, y: 150 },
      },
      {
        id: '3',
        type: 'approval',
        data: { approvalLevel: 'Manager', timeout: '24' },
        position: { x: 250, y: 250 },
      },
      {
        id: '4',
        type: 'status',
        data: { targetStatus: 'Confirmed' },
        position: { x: 250, y: 350 },
      },
      {
        id: '5',
        type: 'notification',
        data: { notificationType: 'Email + SMS', message: 'Booking confirmed' },
        position: { x: 250, y: 450 },
      },
      {
        id: '6',
        type: 'end',
        data: { label: 'Complete' },
        position: { x: 250, y: 550 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', label: 'Approved', animated: true },
      { id: 'e4-5', source: '4', target: '5', animated: true },
      { id: 'e5-6', source: '5', target: '6', animated: true },
    ],
  },
  {
    name: 'Auto-Confirm',
    description: 'Automatic confirmation without approval required',
    isActive: true,
    assignedFacilities: [],
    nodes: [
      {
        id: '1',
        type: 'start',
        data: { label: 'Booking Created' },
        position: { x: 250, y: 50 },
      },
      {
        id: '2',
        type: 'status',
        data: { targetStatus: 'Confirmed' },
        position: { x: 250, y: 150 },
      },
      {
        id: '3',
        type: 'notification',
        data: { notificationType: 'Email + SMS', message: 'Booking auto-confirmed' },
        position: { x: 250, y: 250 },
      },
      {
        id: '4',
        type: 'end',
        data: { label: 'Complete' },
        position: { x: 250, y: 350 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
    ],
  },
  {
    name: 'Complex Approval',
    description: 'Multi-level approval with conditions',
    isActive: true,
    assignedFacilities: [],
    nodes: [
      {
        id: '1',
        type: 'start',
        data: { label: 'Booking Created' },
        position: { x: 250, y: 50 },
      },
      {
        id: '2',
        type: 'notification',
        data: { notificationType: 'Email + SMS', message: 'New booking received' },
        position: { x: 250, y: 150 },
      },
      {
        id: '3',
        type: 'condition',
        data: { condition: 'Duration > 4 hours' },
        position: { x: 250, y: 250 },
      },
      {
        id: '4',
        type: 'approval',
        data: { approvalLevel: 'Manager', timeout: '24' },
        position: { x: 150, y: 350 },
      },
      {
        id: '5',
        type: 'approval',
        data: { approvalLevel: 'Admin', timeout: '48' },
        position: { x: 350, y: 350 },
      },
      {
        id: '6',
        type: 'status',
        data: { targetStatus: 'Confirmed' },
        position: { x: 250, y: 450 },
      },
      {
        id: '7',
        type: 'notification',
        data: { notificationType: 'Email + SMS', message: 'Booking confirmed' },
        position: { x: 250, y: 550 },
      },
      {
        id: '8',
        type: 'end',
        data: { label: 'Complete' },
        position: { x: 250, y: 650 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', label: 'Short', animated: true },
      { id: 'e3-5', source: '3', target: '5', label: 'Long', animated: true },
      { id: 'e4-6', source: '4', target: '6', animated: true },
      { id: 'e5-6', source: '5', target: '6', animated: true },
      { id: 'e6-7', source: '6', target: '7', animated: true },
      { id: 'e7-8', source: '7', target: '8', animated: true },
    ],
  },
];
