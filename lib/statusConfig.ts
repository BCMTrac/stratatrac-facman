import { BookingStatus } from './types';

// Status Configuration
export interface StatusConfig {
  id: BookingStatus;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  allowedNextStatuses: BookingStatus[];
  icon: string;
  notifyUser: boolean;
  notifyAdmin: boolean;
  userCanCancel: boolean;
}

export const BOOKING_STATUSES: Record<BookingStatus, StatusConfig> = {
  pending: {
    id: 'pending',
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-500',
    description: 'Awaiting approval from management',
    allowedNextStatuses: ['confirmed', 'rejected', 'cancelled'],
    icon: '⏳',
    notifyUser: true,
    notifyAdmin: true,
    userCanCancel: true
  },
  confirmed: {
    id: 'confirmed',
    label: 'Confirmed',
    color: 'text-green-700',
    bgColor: 'bg-green-500',
    description: 'Booking approved and confirmed',
    allowedNextStatuses: ['in-progress', 'cancelled'],
    icon: '✅',
    notifyUser: true,
    notifyAdmin: false,
    userCanCancel: true
  },
  'in-progress': {
    id: 'in-progress',
    label: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-500',
    description: 'Currently active',
    allowedNextStatuses: ['completed', 'cancelled'],
    icon: '🔄',
    notifyUser: false,
    notifyAdmin: false,
    userCanCancel: false
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    color: 'text-gray-700',
    bgColor: 'bg-gray-500',
    description: 'Successfully completed',
    allowedNextStatuses: [],
    icon: '🎉',
    notifyUser: true,
    notifyAdmin: false,
    userCanCancel: false
  },
  cancelled: {
    id: 'cancelled',
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-500',
    description: 'Cancelled by user or admin',
    allowedNextStatuses: [],
    icon: '❌',
    notifyUser: true,
    notifyAdmin: true,
    userCanCancel: false
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    color: 'text-red-900',
    bgColor: 'bg-red-700',
    description: 'Not approved by management',
    allowedNextStatuses: [],
    icon: '🚫',
    notifyUser: true,
    notifyAdmin: false,
    userCanCancel: false
  }
};

// Helper function to get status config
export const getStatusConfig = (status: BookingStatus): StatusConfig => {
  return BOOKING_STATUSES[status] || BOOKING_STATUSES.pending;
};

// Helper function to check if status change is allowed
export const canChangeStatus = (currentStatus: BookingStatus, newStatus: BookingStatus): boolean => {
  const config = getStatusConfig(currentStatus);
  return config.allowedNextStatuses.includes(newStatus);
};

// Helper function to check if user can cancel
export const canUserCancel = (status: BookingStatus): boolean => {
  return getStatusConfig(status).userCanCancel;
};
