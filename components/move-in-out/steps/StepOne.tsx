'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/lib/store/useAppStore';
import { addDays, format } from 'date-fns';

interface StepOneProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepOne({ data, updateData, errors }: StepOneProps) {
  const { moveInOutSettings } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const maxDate = format(addDays(new Date(), moveInOutSettings.advanceBookingDays), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          📋 Move Type & Scheduling
        </h3>

        {/* Move Type */}
        <div className="space-y-3 mb-4">
          <Label>Move Type *</Label>
          <RadioGroup
            value={data.moveType}
            onValueChange={(value) => updateData('moveType', value)}
          >
            <div className="flex items-center space-x-2 bg-card p-3 rounded-lg border">
              <RadioGroupItem value="in" id="moveTypeIn" />
              <Label htmlFor="moveTypeIn" className="cursor-pointer flex-1">
                Moving In
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-card p-3 rounded-lg border">
              <RadioGroupItem value="out" id="moveTypeOut" />
              <Label htmlFor="moveTypeOut" className="cursor-pointer flex-1">
                Moving Out
              </Label>
            </div>
          </RadioGroup>
          {errors.moveType && (
            <p className="text-sm text-destructive">{errors.moveType}</p>
          )}
        </div>

        {/* Move Date */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="moveDate">Move Date *</Label>
          <Input
            id="moveDate"
            type="date"
            min={today}
            max={maxDate}
            value={data.moveDate}
            onChange={(e) => updateData('moveDate', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Can book up to {moveInOutSettings.advanceBookingDays} days in advance
          </p>
          {errors.moveDate && (
            <p className="text-sm text-destructive">{errors.moveDate}</p>
          )}
        </div>

        {/* Time Slot */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="moveTime">Preferred Time Slot *</Label>
          <Select
            value={data.moveTime}
            onValueChange={(value) => updateData('moveTime', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time slot..." />
            </SelectTrigger>
            <SelectContent>
              {moveInOutSettings.timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moveTime && (
            <p className="text-sm text-destructive">{errors.moveTime}</p>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="moveDuration">Estimated Duration *</Label>
          <Select
            value={data.moveDuration}
            onValueChange={(value) => updateData('moveDuration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration..." />
            </SelectTrigger>
            <SelectContent>
              {moveInOutSettings.durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moveDuration && (
            <p className="text-sm text-destructive">{errors.moveDuration}</p>
          )}
        </div>
      </div>
    </div>
  );
}