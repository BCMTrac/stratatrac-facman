'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FacilityTimeSettings } from '@/lib/types';
import { toast } from 'sonner';

interface FacilityTimeSettingsModalProps {
  open: boolean;
  onClose: () => void;
  facilityName: string;
  currentSettings?: FacilityTimeSettings;
  onSave: (settings: FacilityTimeSettings) => void;
}

const defaultSettings: FacilityTimeSettings = {
  timeIntervalMinutes: 30,
  defaultDurationMinutes: 60,
  minDurationMinutes: 30,
  maxDurationMinutes: 240,
  operatingHours: {
    start: '07:00',
    end: '22:00',
  },
  allowMultipleSlots: true,
  advanceBookingDays: 30,
};

export function FacilityTimeSettingsModal({
  open,
  onClose,
  facilityName,
  currentSettings,
  onSave,
}: FacilityTimeSettingsModalProps) {
  const [settings, setSettings] = useState<FacilityTimeSettings>(
    currentSettings || defaultSettings
  );

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    } else {
      setSettings(defaultSettings);
    }
  }, [currentSettings, open]);

  const handleSave = () => {
    // Validation
    if (settings.minDurationMinutes > settings.maxDurationMinutes) {
      toast.error('Minimum duration cannot be greater than maximum duration');
      return;
    }

    if (settings.defaultDurationMinutes < settings.minDurationMinutes) {
      toast.error('Default duration cannot be less than minimum duration');
      return;
    }

    if (settings.defaultDurationMinutes > settings.maxDurationMinutes) {
      toast.error('Default duration cannot be greater than maximum duration');
      return;
    }

    if (settings.operatingHours.start >= settings.operatingHours.end) {
      toast.error('Opening time must be before closing time');
      return;
    }

    onSave(settings);
    toast.success('Time settings saved successfully');
    onClose();
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Time Settings - {facilityName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Time Interval */}
          <div className="space-y-2">
            <Label htmlFor="timeInterval">Time Interval (minutes)</Label>
            <Select
              value={settings.timeIntervalMinutes.toString()}
              onValueChange={(value) =>
                setSettings({ ...settings, timeIntervalMinutes: parseInt(value) })
              }
            >
              <SelectTrigger id="timeInterval">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Time slots will be available in these intervals
            </p>
          </div>

          {/* Default Duration */}
          <div className="space-y-2">
            <Label htmlFor="defaultDuration">Default Booking Duration (minutes)</Label>
            <Input
              id="defaultDuration"
              type="number"
              min="15"
              step="15"
              value={settings.defaultDurationMinutes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultDurationMinutes: parseInt(e.target.value) || 60,
                })
              }
            />
            <p className="text-sm text-muted-foreground">
              Pre-filled duration when creating a new booking
            </p>
          </div>

          {/* Duration Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minDuration">Minimum Duration (minutes)</Label>
              <Input
                id="minDuration"
                type="number"
                min="15"
                step="15"
                value={settings.minDurationMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    minDurationMinutes: parseInt(e.target.value) || 30,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDuration">Maximum Duration (minutes)</Label>
              <Input
                id="maxDuration"
                type="number"
                min="15"
                step="15"
                value={settings.maxDurationMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxDurationMinutes: parseInt(e.target.value) || 240,
                  })
                }
              />
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2">
            <Label>Operating Hours</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm text-muted-foreground">
                  Opening Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.operatingHours.start}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm text-muted-foreground">
                  Closing Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.operatingHours.end}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Advance Booking Days */}
          <div className="space-y-2">
            <Label htmlFor="advanceBooking">Advance Booking Period (days)</Label>
            <Input
              id="advanceBooking"
              type="number"
              min="1"
              max="365"
              value={settings.advanceBookingDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  advanceBookingDays: parseInt(e.target.value) || 30,
                })
              }
            />
            <p className="text-sm text-muted-foreground">
              How far in advance residents can book this facility
            </p>
          </div>

          {/* Allow Multiple Slots */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Allow Multiple Consecutive Slots</Label>
              <p className="text-sm text-muted-foreground">
                Enable residents to book multiple time slots in sequence
              </p>
            </div>
            <Switch
              checked={settings.allowMultipleSlots}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowMultipleSlots: checked })
              }
            />
          </div>

          {/* Summary Preview */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-semibold text-sm">Configuration Summary</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>• Time slots every {settings.timeIntervalMinutes} minutes</p>
              <p>
                • Bookings from {settings.minDurationMinutes} to {settings.maxDurationMinutes} minutes
              </p>
              <p>
                • Open {settings.operatingHours.start} - {settings.operatingHours.end}
              </p>
              <p>• Can book up to {settings.advanceBookingDays} days ahead</p>
              <p>
                • Multiple slots: {settings.allowMultipleSlots ? 'Allowed' : 'Not allowed'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
