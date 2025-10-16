'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Facility } from '@/lib/types';
import { useMemo } from 'react';

const bookingSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  durationMinutes: z.number().min(1, 'Please select duration'),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Helper function to generate time slots based on facility settings
function generateTimeSlots(facility: Facility | undefined): string[] {
  if (!facility?.timeSettings) {
    // Default time slots if no settings configured
    const slots: string[] = [];
    for (let hour = 7; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      }
    }
    return slots;
  }

  const settings = facility.timeSettings;
  const slots: string[] = [];
  const [startHour, startMinute] = settings.operatingHours.start.split(':').map(Number);
  const [endHour, endMinute] = settings.operatingHours.end.split(':').map(Number);

  let currentTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    currentTime += settings.timeIntervalMinutes;
  }

  return slots;
}

// Helper function to generate duration options
function generateDurationOptions(facility: Facility | undefined): Array<{ label: string; value: number }> {
  if (!facility?.timeSettings) {
    // Default durations
    return [
      { label: '30 minutes', value: 30 },
      { label: '1 hour', value: 60 },
      { label: '1.5 hours', value: 90 },
      { label: '2 hours', value: 120 },
      { label: '3 hours', value: 180 },
      { label: '4 hours', value: 240 },
    ];
  }

  const settings = facility.timeSettings;
  const options: Array<{ label: string; value: number }> = [];
  
  for (let duration = settings.minDurationMinutes; duration <= settings.maxDurationMinutes; duration += settings.timeIntervalMinutes) {
    if (duration < 60) {
      options.push({ label: `${duration} minutes`, value: duration });
    } else {
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;
      if (mins === 0) {
        options.push({ label: `${hours} ${hours === 1 ? 'hour' : 'hours'}`, value: duration });
      } else {
        options.push({ label: `${hours}h ${mins}m`, value: duration });
      }
    }
  }

  return options;
}

// Helper function to format duration
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours}h ${mins}m`;
}

export function BookingFormModal() {
  const { 
    isBookingModalOpen, 
    setBookingModalOpen, 
    selectedFacility,
    currentUser,
    addBooking,
    addAuditLog,
    facilities,
    sendNotification
  } = useAppStore();

  // Get the current facility object with time settings
  const currentFacility = useMemo(() => {
    if (!selectedFacility) return undefined;
    
    for (const category of Object.values(facilities)) {
      const facility = category.facilities.find(f => f.name === selectedFacility);
      if (facility) return facility;
    }
    return undefined;
  }, [selectedFacility, facilities]);

  // Generate time slots based on facility settings
  const availableTimeSlots = useMemo(() => {
    return generateTimeSlots(currentFacility);
  }, [currentFacility]);

  // Generate duration options based on facility settings
  const durationOptions = useMemo(() => {
    return generateDurationOptions(currentFacility);
  }, [currentFacility]);

  // Get default duration
  const defaultDuration = currentFacility?.timeSettings?.defaultDurationMinutes || 60;

  // Calculate max booking date based on advance booking settings
  const maxBookingDate = useMemo(() => {
    const advanceDays = currentFacility?.timeSettings?.advanceBookingDays || 30;
    return addDays(new Date(), advanceDays);
  }, [currentFacility]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      durationMinutes: defaultDuration,
    },
  });

  const selectedDate = watch('date');

  const onSubmit = (data: BookingFormData) => {
    if (!currentUser || !selectedFacility) return;

    // Find the category for the selected facility
    let facilityCategory = '';
    Object.entries(facilities).forEach(([categoryId, category]) => {
      if (category.facilities.some(f => f.name === selectedFacility)) {
        facilityCategory = categoryId;
      }
    });

    const newBooking = {
      id: 'BK' + Date.now().toString().slice(-6),
      facility: selectedFacility,
      category: facilityCategory as any,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.timeSlot,
      duration: formatDuration(data.durationMinutes),
      durationMinutes: data.durationMinutes,
      user: {
        name: currentUser.name,
        unit: 'A101',
        email: currentUser.email,
      },
      purpose: data.purpose,
      createdBy: currentUser.email,
      status: 'pending' as const,
      statusHistory: [{
        status: 'pending' as const,
        timestamp: new Date().toISOString(),
        updatedBy: currentUser.email,
        note: 'Booking created'
      }],
      notifications: []
    };

    addBooking(newBooking);
    
    // Audit log for booking creation
    addAuditLog({
      action: 'booking_created',
      entity: 'booking',
      entityId: newBooking.id,
      userId: currentUser.email,
      userName: currentUser.name,
      details: `Created booking for ${selectedFacility} on ${format(data.date, 'MMM d, yyyy')} at ${data.timeSlot}`,
      timestamp: new Date().toISOString()
    });
    
    // Send confirmation notifications
    sendNotification(
      newBooking.id,
      'email',
      currentUser.email,
      `Your booking for ${selectedFacility} on ${format(data.date, 'MMM d')} at ${data.timeSlot} has been confirmed.`,
      'booking_created'
    );
    
    sendNotification(
      newBooking.id,
      'sms',
      currentUser.email, // In real app would be phone number
      `Booking confirmed: ${selectedFacility} on ${format(data.date, 'MMM d')} at ${data.timeSlot}`,
      'booking_created'
    );
    toast.success(
      `Booking created successfully! ID: ${newBooking.id}`,
      {
        description: `${selectedFacility} - ${data.timeSlot} for ${formatDuration(data.durationMinutes)}`,
      }
    );
    setBookingModalOpen(false);
    reset();
  };

  const handleClose = () => {
    setBookingModalOpen(false);
    reset();
  };

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            📅 Make Booking
          </DialogTitle>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Booking for: <strong>{selectedFacility}</strong>
            </p>
            {currentFacility?.timeSettings && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                <Clock className="h-3 w-3" />
                <span>
                  {currentFacility.timeSettings.operatingHours.start} - {currentFacility.timeSettings.operatingHours.end}
                </span>
                <span>•</span>
                <span>{currentFacility.timeSettings.timeIntervalMinutes} min slots</span>
                <span>•</span>
                <span>Book up to {currentFacility.timeSettings.advanceBookingDays} days ahead</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !selectedDate && 'text-muted-foreground'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setValue('date', date as Date)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date > maxBookingDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Slot *</Label>
            <Select onValueChange={(value) => setValue('timeSlot', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timeSlot && (
              <p className="text-sm text-destructive">{errors.timeSlot.message}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Select 
              onValueChange={(value) => setValue('durationMinutes', parseInt(value))}
              defaultValue={defaultDuration.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.durationMinutes && (
              <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
            )}
            {currentFacility?.timeSettings && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Min: {formatDuration(currentFacility.timeSettings.minDurationMinutes)} | 
                Max: {formatDuration(currentFacility.timeSettings.maxDurationMinutes)}
              </p>
            )}
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              placeholder="e.g., Tennis practice, Birthday party"
              {...register('purpose')}
            />
            {errors.purpose && (
              <p className="text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or additional information..."
              rows={3}
              {...register('notes')}
            />
          </div>

          {/* User Info Display */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">Booking Details:</p>
            <p className="text-sm text-muted-foreground">
              <strong>Name:</strong> {currentUser?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {currentUser?.email}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}