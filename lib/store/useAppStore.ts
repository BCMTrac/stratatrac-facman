import { create } from 'zustand';
import { User, Booking, FacilityCategories, Facility, FacilityTimeSettings, MoveInOutSettings, BookingStatus, StatusHistoryEntry, NotificationLog, AuditLog } from '../types';
import { defaultFacilities, sampleBookings } from '../data';

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Facility state
  facilities: FacilityCategories;
  selectedFacility: string | null;
  setSelectedFacility: (facility: string | null) => void;
  
  // Facility management
  addFacilityToCategory: (categoryId: string, facility: Omit<Facility, 'id'>) => void;
  updateFacility: (categoryId: string, facilityId: string, updates: Partial<Facility>) => void;
  updateFacilityTimeSettings: (categoryId: string, facilityId: string, timeSettings: FacilityTimeSettings) => void;
  deleteFacility: (categoryId: string, facilityId: string) => void;
  addCategory: (categoryId: string, categoryName: string, icon: string) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Booking state
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus, updatedBy: string, note?: string) => void;
  sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void;
  
  // Settings state
  moveInOutDepositAmount: number;
  setMoveInOutDepositAmount: (amount: number) => void;
  moveInOutSettings: MoveInOutSettings;
  setMoveInOutSettings: (settings: MoveInOutSettings) => void;
  
  // Modal state
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  isMoveInOutModalOpen: boolean;
  setMoveInOutModalOpen: (open: boolean) => void;
  isMoveInOutSettingsModalOpen: boolean;
  setMoveInOutSettingsModalOpen: (open: boolean) => void;
  isConfigureFacilitiesModalOpen: boolean;
  setConfigureFacilitiesModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setAddCategoryModalOpen: (open: boolean) => void;
  isConciergeSettingsModalOpen: boolean;
  setConciergeSettingsModalOpen: (open: boolean) => void;
  isBuildingSettingsModalOpen: boolean;
  setBuildingSettingsModalOpen: (open: boolean) => void;
  isSystemSettingsModalOpen: boolean;
  setSystemSettingsModalOpen: (open: boolean) => void;
  
  // Audit logging
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;
  getAuditLogs: (filters?: { entity?: string; userId?: string; action?: string }) => AuditLog[];
  
  // Reset function
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial user state
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Initial facility state
  facilities: defaultFacilities,
  selectedFacility: null,
  setSelectedFacility: (facility) => set({ selectedFacility: facility }),
  
  // Facility management functions
  addFacilityToCategory: (categoryId, facility) => set((state) => {
    const newFacility: Facility = {
      ...facility,
      id: `${categoryId}-${Date.now()}`,
    };
    
    return {
      facilities: {
        ...state.facilities,
        [categoryId]: {
          ...state.facilities[categoryId],
          facilities: [...state.facilities[categoryId].facilities, newFacility],
        },
      },
    };
  }),
  
  updateFacility: (categoryId, facilityId, updates) => set((state) => ({
    facilities: {
      ...state.facilities,
      [categoryId]: {
        ...state.facilities[categoryId],
        facilities: state.facilities[categoryId].facilities.map((f) =>
          f.id === facilityId ? { ...f, ...updates } : f
        ),
      },
    },
  })),
  
  updateFacilityTimeSettings: (categoryId, facilityId, timeSettings) => set((state) => ({
    facilities: {
      ...state.facilities,
      [categoryId]: {
        ...state.facilities[categoryId],
        facilities: state.facilities[categoryId].facilities.map((f) =>
          f.id === facilityId ? { ...f, timeSettings } : f
        ),
      },
    },
  })),
  
  deleteFacility: (categoryId, facilityId) => set((state) => ({
    facilities: {
      ...state.facilities,
      [categoryId]: {
        ...state.facilities[categoryId],
        facilities: state.facilities[categoryId].facilities.filter(
          (f) => f.id !== facilityId
        ),
      },
    },
  })),
  
  addCategory: (categoryId, categoryName, icon) => set((state) => ({
    facilities: {
      ...state.facilities,
      [categoryId]: {
        name: categoryName,
        icon: icon,
        isCustom: true,
        facilities: [],
      },
    },
  })),
  
  deleteCategory: (categoryId) => set((state) => {
    const { [categoryId]: deleted, ...remaining } = state.facilities;
    return { facilities: remaining };
  }),
  
  // Initial booking state
  bookings: sampleBookings,
  addBooking: (booking) => set((state) => ({ 
    bookings: [booking, ...state.bookings] 
  })),
  removeBooking: (id) => set((state) => ({ 
    bookings: state.bookings.filter(b => b.id !== id) 
  })),
  
  updateBookingStatus: (bookingId, newStatus, updatedBy, note) => set((state) => {
    const booking = state.bookings.find(b => b.id === bookingId);
    const oldStatus = booking?.status || 'unknown';
    
    // Add audit log
    state.addAuditLog({
      action: 'booking_status_changed',
      entity: 'booking',
      entityId: bookingId,
      userId: updatedBy,
      userName: updatedBy,
      details: `Status changed from ${oldStatus} to ${newStatus}${note ? `: ${note}` : ''}`,
      timestamp: new Date().toISOString()
    });
    
    return {
      bookings: state.bookings.map(booking => {
        if (booking.id === bookingId) {
          const statusEntry: StatusHistoryEntry = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            updatedBy,
            note
          };
          
          return {
            ...booking,
            status: newStatus,
            statusHistory: [...(booking.statusHistory || []), statusEntry]
          };
        }
        return booking;
      })
    };
  }),
  
  sendNotification: (bookingId, type, recipient, message, trigger) => set((state) => ({
    bookings: state.bookings.map(booking => {
      if (booking.id === bookingId) {
        const notification: NotificationLog = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          recipient,
          message,
          status: 'sent', // In real app, this would be 'pending' then updated
          sentAt: new Date().toISOString(),
          trigger
        };
        
        return {
          ...booking,
          notifications: [...(booking.notifications || []), notification]
        };
      }
      return booking;
    })
  })),
  
  // Initial settings state
  moveInOutDepositAmount: 50,
  setMoveInOutDepositAmount: (amount) => set({ moveInOutDepositAmount: amount }),
  moveInOutSettings: {
    depositAmount: 50,
    timeSlots: [
      '08:00-10:00',
      '10:00-12:00',
      '12:00-14:00',
      '14:00-16:00',
      '16:00-18:00'
    ],
    durations: [
      { label: '2 hours', value: '2' },
      { label: '4 hours', value: '4' },
      { label: '6 hours', value: '6' },
      { label: 'Full day (8 hours)', value: '8' }
    ],
    advanceBookingDays: 30,
    loadingDocks: ['Dock A', 'Dock B', 'Dock C'],
    operatingHours: {
      start: '07:00',
      end: '19:00'
    },
    requireInsurance: true,
    maxMoversAllowed: 6
  },
  setMoveInOutSettings: (settings) => set({ 
    moveInOutSettings: settings,
    moveInOutDepositAmount: settings.depositAmount 
  }),
  
  // Initial modal state
  isLoginModalOpen: true,
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
  isBookingModalOpen: false,
  setBookingModalOpen: (open) => set({ isBookingModalOpen: open }),
  isMoveInOutModalOpen: false,
  setMoveInOutModalOpen: (open) => set({ isMoveInOutModalOpen: open }),
  isMoveInOutSettingsModalOpen: false,
  setMoveInOutSettingsModalOpen: (open) => set({ isMoveInOutSettingsModalOpen: open }),
  isConfigureFacilitiesModalOpen: false,
  setConfigureFacilitiesModalOpen: (open) => set({ isConfigureFacilitiesModalOpen: open }),
  isAddCategoryModalOpen: false,
  setAddCategoryModalOpen: (open) => set({ isAddCategoryModalOpen: open }),
  isConciergeSettingsModalOpen: false,
  setConciergeSettingsModalOpen: (open) => set({ isConciergeSettingsModalOpen: open }),
  isBuildingSettingsModalOpen: false,
  setBuildingSettingsModalOpen: (open) => set({ isBuildingSettingsModalOpen: open }),
  isSystemSettingsModalOpen: false,
  setSystemSettingsModalOpen: (open) => set({ isSystemSettingsModalOpen: open }),
  
  // Audit logging
  auditLogs: [],
  addAuditLog: (log) => set((state) => ({
    auditLogs: [{
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }, ...state.auditLogs]
  })),
  getAuditLogs: (filters) => {
    const state = useAppStore.getState();
    let logs = state.auditLogs;
    
    if (filters?.entity) {
      logs = logs.filter(log => log.entity === filters.entity);
    }
    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    
    return logs;
  },
  
  // Logout function
  logout: () => set({ 
    currentUser: null, 
    selectedFacility: null,
    isLoginModalOpen: true 
  }),
}));