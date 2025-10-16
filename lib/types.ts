// User Types
export type UserRole = 'bcmtrac' | 'miduser' | 'standard';

export interface User {
  username: string;
  role: UserRole;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
}

// Facility Types
export type FacilityCategory = 
  | 'recreation' 
  | 'sports' 
  | 'gym' 
  | 'restaurant' 
  | 'maintenance' 
  | 'moveinout' 
  | 'concierge'
  | string; // Allow custom categories

export interface FacilityTimeSettings {
  timeIntervalMinutes: number; // 15, 30, 60, etc.
  defaultDurationMinutes: number; // default booking duration
  minDurationMinutes: number; // minimum allowed duration
  maxDurationMinutes: number; // maximum allowed duration
  operatingHours: {
    start: string; // e.g., '07:00'
    end: string; // e.g., '22:00'
  };
  allowMultipleSlots: boolean; // allow booking multiple consecutive slots
  advanceBookingDays: number; // how far in advance bookings can be made
}

export interface Facility {
  id: string;
  icon: string;
  name: string;
  enabled: boolean;
  timeSettings?: FacilityTimeSettings; // optional time configuration
}

export interface FacilityGroup {
  name: string;
  icon: string;
  facilities: Facility[];
  isCustom: boolean;
}

export interface FacilityCategories {
  [key: string]: FacilityGroup;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';

export interface BookingUser {
  name: string;
  unit: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  id: string;
  facility: string;
  category: FacilityCategory;
  date: string;
  time: string;
  duration?: string;
  durationMinutes?: number;
  user: BookingUser;
  purpose: string;
  createdBy: string;
  status?: BookingStatus;
  statusHistory?: StatusHistoryEntry[];
  notifications?: NotificationLog[];
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface NotificationLog {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  subject?: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  trigger: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

// Move In/Out Types
export interface MoveInOutSettings {
  depositAmount: number;
  timeSlots: string[];
  durations: Array<{ label: string; value: string }>;
  advanceBookingDays: number;
  loadingDocks: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  requireInsurance: boolean;
  maxMoversAllowed: number;
}

export interface MoveInOutRequest {
  id: string;
  type: 'in' | 'out';
  date: string;
  timeSlot: string;
  duration: string;
  resident: {
    name: string;
    unit: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  movingCompany: {
    name: string;
    contact: string;
    phone: string;
    vehicleRego: string;
    vehicleType: string;
    numMovers: number;
  };
  facilities: {
    loadingDock: boolean;
    serviceElevator: boolean;
    visitorParking: boolean;
    movingTrolleys: boolean;
    dockSelection: string;
    parkingBay: string;
  };
  payment: {
    method: string;
    depositAmount: number;
    refundBSB: string;
    refundAccount: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  createdBy: string;
}