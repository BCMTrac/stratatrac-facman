// Example: How to use the time settings in your booking logic

import { Facility, FacilityTimeSettings } from '@/lib/types';

/**
 * Generate available time slots based on facility time settings
 */
export function generateTimeSlots(
  facility: Facility,
  selectedDate: Date
): string[] {
  const settings = facility.timeSettings;
  
  // If no time settings, use defaults
  if (!settings) {
    return generateDefaultTimeSlots();
  }

  const slots: string[] = [];
  const [startHour, startMinute] = settings.operatingHours.start.split(':').map(Number);
  const [endHour, endMinute] = settings.operatingHours.end.split(':').map(Number);

  let currentTime = startHour * 60 + startMinute; // Convert to minutes
  const endTime = endHour * 60 + endMinute;

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    slots.push(timeString);
    
    currentTime += settings.timeIntervalMinutes;
  }

  return slots;
}

/**
 * Validate if a booking duration is allowed
 */
export function validateBookingDuration(
  facility: Facility,
  durationMinutes: number
): { valid: boolean; message?: string } {
  const settings = facility.timeSettings;

  if (!settings) {
    // Use default validation
    if (durationMinutes < 30) {
      return { valid: false, message: 'Minimum duration is 30 minutes' };
    }
    if (durationMinutes > 240) {
      return { valid: false, message: 'Maximum duration is 4 hours' };
    }
    return { valid: true };
  }

  if (durationMinutes < settings.minDurationMinutes) {
    return {
      valid: false,
      message: `Minimum duration is ${settings.minDurationMinutes} minutes`,
    };
  }

  if (durationMinutes > settings.maxDurationMinutes) {
    return {
      valid: false,
      message: `Maximum duration is ${settings.maxDurationMinutes} minutes`,
    };
  }

  return { valid: true };
}

/**
 * Check if a date is within the advance booking window
 */
export function isDateBookable(
  facility: Facility,
  bookingDate: Date
): { bookable: boolean; message?: string } {
  const settings = facility.timeSettings;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxAdvanceDays = settings?.advanceBookingDays || 30;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);

  if (bookingDate < today) {
    return { bookable: false, message: 'Cannot book dates in the past' };
  }

  if (bookingDate > maxDate) {
    return {
      bookable: false,
      message: `Can only book ${maxAdvanceDays} days in advance`,
    };
  }

  return { bookable: true };
}

/**
 * Get the default duration for initial form value
 */
export function getDefaultDuration(facility: Facility): number {
  return facility.timeSettings?.defaultDurationMinutes || 60;
}

/**
 * Check if multiple consecutive slots can be booked
 */
export function canBookMultipleSlots(facility: Facility): boolean {
  return facility.timeSettings?.allowMultipleSlots ?? true;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Calculate end time based on start time and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;
  
  const endHours = Math.floor(endMinutes / 60) % 24;
  const endMins = endMinutes % 60;
  
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}

// Default time slots (when no settings configured)
function generateDefaultTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 7; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
}

// Example usage in a booking form component:
/*
import { generateTimeSlots, validateBookingDuration, getDefaultDuration } from '@/lib/utils/timeSettings';

function BookingForm({ facility }: { facility: Facility }) {
  const availableSlots = generateTimeSlots(facility, selectedDate);
  const defaultDuration = getDefaultDuration(facility);
  
  const handleDurationChange = (duration: number) => {
    const validation = validateBookingDuration(facility, duration);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    setDuration(duration);
  };
  
  // ... rest of component
}
*/
