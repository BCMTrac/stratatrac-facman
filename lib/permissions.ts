import { BookingStatus } from '../types';

// Role-based status change permissions
export const STATUS_PERMISSIONS = {
  standard: {
    // Standard users can only cancel their own bookings
    canChangeTo: ['cancelled'] as BookingStatus[],
    canChangeFrom: ['pending', 'confirmed', 'in-progress'] as BookingStatus[],
  },
  miduser: {
    // Mid users (facility managers) can approve, reject, and manage
    canChangeTo: ['confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'] as BookingStatus[],
    canChangeFrom: ['pending', 'confirmed', 'in-progress'] as BookingStatus[],
  },
  bcmtrac: {
    // Super admins can do anything
    canChangeTo: ['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'] as BookingStatus[],
    canChangeFrom: ['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'] as BookingStatus[],
  },
};

export function canUserChangeStatus(
  userRole: 'standard' | 'miduser' | 'bcmtrac',
  currentStatus: BookingStatus,
  newStatus: BookingStatus
): boolean {
  const permissions = STATUS_PERMISSIONS[userRole];
  return (
    permissions.canChangeFrom.includes(currentStatus) &&
    permissions.canChangeTo.includes(newStatus)
  );
}

// Workflow access permissions
export const WORKFLOW_PERMISSIONS = {
  standard: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canExecute: false,
    canApprove: false,
  },
  miduser: {
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canExecute: false,
    canApprove: true, // Can approve bookings
  },
  bcmtrac: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExecute: true,
    canApprove: true,
  },
};
