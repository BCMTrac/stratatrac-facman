import { FacilityCategories, Booking } from './types';

export const defaultFacilities: FacilityCategories = {
  recreation: {
    name: 'Recreation',
    icon: '🏛️',
    isCustom: false,
    facilities: [
      { id: 'rec-1', icon: '🏛️', name: 'Clubhouse', enabled: true },
      { id: 'rec-2', icon: '🎉', name: 'Entertainment Area', enabled: true },
      { id: 'rec-3', icon: '🍔', name: 'BBQ Area 1', enabled: true },
      { id: 'rec-4', icon: '🎊', name: 'Party Room', enabled: true }
    ]
  },
  sports: {
    name: 'Sports',
    icon: '🏃',
    isCustom: false,
    facilities: [
      { id: 'spt-1', icon: '🎾', name: 'Tennis Court 1', enabled: true },
      { id: 'spt-2', icon: '🎾', name: 'Tennis Court 2', enabled: true },
      { id: 'spt-3', icon: '🎾', name: 'Tennis Court 3', enabled: true },
      { id: 'spt-4', icon: '🏊', name: 'Swimming Pool', enabled: true },
      { id: 'spt-5', icon: '🏀', name: 'Basketball Court', enabled: true }
    ]
  },
  gym: {
    name: 'Gym Equipment',
    icon: '💪',
    isCustom: false,
    facilities: [
      { id: 'gym-1', icon: '🏃', name: 'Treadmill 1', enabled: true },
      { id: 'gym-2', icon: '🏃', name: 'Treadmill 2', enabled: true },
      { id: 'gym-3', icon: '🚴', name: 'Exercise Bike 1', enabled: true },
      { id: 'gym-4', icon: '🚴', name: 'Exercise Bike 2', enabled: true },
      { id: 'gym-5', icon: '🚣', name: 'Rowing Machine', enabled: true },
      { id: 'gym-6', icon: '🏋️', name: 'Weight Station', enabled: true }
    ]
  },
  restaurant: {
    name: 'Restaurant / Dining',
    icon: '🍽️',
    isCustom: false,
    facilities: [
      { id: 'rst-1', icon: '🍽️', name: 'Main Dining Room', enabled: true },
      { id: 'rst-2', icon: '👨‍🍳', name: 'Private Dining Room', enabled: true },
      { id: 'rst-3', icon: '🍷', name: 'Wine Tasting Room', enabled: true }
    ]
  },
  maintenance: {
    name: 'Maintenance Request',
    icon: '🔧',
    isCustom: false,
    facilities: [
      { id: 'mnt-1', icon: '🔧', name: 'Maintenance Request', enabled: true }
    ]
  },
  moveinout: {
    name: 'Move In / Move Out',
    icon: '📦',
    isCustom: false,
    facilities: [
      { id: 'mio-1', icon: '📦', name: 'Move In / Move Out Request', enabled: true }
    ]
  },
  concierge: {
    name: 'Concierge Services',
    icon: '🛎️',
    isCustom: false,
    facilities: [
      { id: 'con-1', icon: '📦', name: 'Package Collection', enabled: true },
      { id: 'con-2', icon: '📝', name: 'Guest Registration', enabled: true }
    ]
  }
};

export const sampleBookings: Booking[] = [
  {
    id: 'BK001',
    facility: 'Tennis Court 1',
    category: 'sports',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '1 hour',
    durationMinutes: 60,
    user: { name: 'Alice Johnson', unit: 'A102' },
    purpose: 'Tennis Practice',
    createdBy: 'alice@example.com',
    status: 'confirmed',
    statusHistory: [{
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      updatedBy: 'alice@example.com',
      note: 'Booking created'
    }],
    notifications: [
      {
        id: 'n001',
        type: 'email',
        recipient: 'alice@example.com',
        message: 'Your booking for Tennis Court 1 has been confirmed.',
        status: 'sent',
        sentAt: new Date().toISOString(),
        trigger: 'booking_created'
      },
      {
        id: 'n002',
        type: 'sms',
        recipient: 'alice@example.com',
        message: 'Booking confirmed: Tennis Court 1 on ' + new Date().toLocaleDateString(),
        status: 'sent',
        sentAt: new Date().toISOString(),
        trigger: 'booking_created'
      }
    ]
  },
  {
    id: 'BK002',
    facility: 'Clubhouse',
    category: 'recreation',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '18:00',
    duration: '3 hours',
    durationMinutes: 180,
    user: { name: 'Bob Smith', unit: 'B205' },
    purpose: 'Birthday Party',
    createdBy: 'bob@example.com',
    status: 'confirmed',
    statusHistory: [{
      status: 'confirmed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      updatedBy: 'bob@example.com',
      note: 'Booking created'
    }],
    notifications: [
      {
        id: 'n003',
        type: 'email',
        recipient: 'bob@example.com',
        message: 'Your booking for Clubhouse has been confirmed.',
        status: 'sent',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        trigger: 'booking_created'
      }
    ]
  },
  {
    id: 'BK003',
    facility: 'Exercise Bike 1',
    category: 'gym',
    date: new Date().toISOString().split('T')[0],
    time: '07:00',
    duration: '30 minutes',
    durationMinutes: 30,
    user: { name: 'Carol Wilson', unit: 'C301' },
    purpose: 'Morning Workout',
    createdBy: 'manager@stratamanagement.com',
    status: 'in-progress',
    statusHistory: [
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        updatedBy: 'manager@stratamanagement.com',
        note: 'Booking created'
      },
      {
        status: 'in-progress',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        updatedBy: 'manager@stratamanagement.com',
        note: 'Workout started'
      }
    ],
    notifications: [
      {
        id: 'n004',
        type: 'email',
        recipient: 'carol@example.com',
        message: 'Your booking is now in progress.',
        status: 'sent',
        sentAt: new Date(Date.now() - 1800000).toISOString(),
        trigger: 'status_changed_to_in-progress'
      }
    ]
  },
  {
    id: 'BK004',
    facility: 'Maintenance Request',
    category: 'maintenance',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    user: { name: 'David Brown', unit: 'D404' },
    purpose: 'Leaking Faucet Repair',
    createdBy: 'resident@example.com',
    status: 'pending',
    statusHistory: [{
      status: 'pending',
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      updatedBy: 'resident@example.com',
      note: 'Awaiting approval'
    }],
    notifications: [
      {
        id: 'n005',
        type: 'email',
        recipient: 'david@example.com',
        message: 'Your maintenance request is pending approval.',
        status: 'sent',
        sentAt: new Date(Date.now() - 5400000).toISOString(),
        trigger: 'booking_created'
      }
    ]
  },
  {
    id: 'BK005',
    facility: 'Package Collection',
    category: 'concierge',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    duration: '15 minutes',
    durationMinutes: 15,
    user: { name: 'Emily White', unit: 'E505' },
    purpose: 'Amazon Package',
    createdBy: 'resident@example.com',
    status: 'completed',
    statusHistory: [
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        updatedBy: 'resident@example.com',
        note: 'Booking created'
      },
      {
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        updatedBy: 'concierge@stratamanagement.com',
        note: 'Package collected'
      }
    ],
    notifications: [
      {
        id: 'n006',
        type: 'sms',
        recipient: 'emily@example.com',
        message: 'Your package is ready for collection.',
        status: 'sent',
        sentAt: new Date(Date.now() - 10800000).toISOString(),
        trigger: 'booking_created'
      },
      {
        id: 'n007',
        type: 'email',
        recipient: 'emily@example.com',
        message: 'Thank you for collecting your package. Your booking is now completed.',
        status: 'sent',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        trigger: 'status_changed_to_completed'
      }
    ]
  }
];

export const userProfiles = {
  bcmtrac: { 
    name: 'System Administrator', 
    email: 'admin@stratamanagement.com', 
    initials: 'SA',
    role: 'bcmtrac' as const,
    avatar: '/images/gary.jpg'
  },
  miduser: { 
    name: 'Facility Manager', 
    email: 'manager@stratamanagement.com', 
    initials: 'FM',
    role: 'miduser' as const,
    avatar: '/images/gary.jpg'
  },
  standard: { 
    name: 'Resident User', 
    email: 'resident@example.com', 
    initials: 'RU',
    role: 'standard' as const,
    avatar: '/images/gary.jpg'
  },
  spock: {
    name: 'Spock - Testing Mode',
    email: 'spock@testing.com',
    initials: '🖖',
    role: 'bcmtrac' as const,
    avatar: '/images/spock.jpg'
  }
};