'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, Clock, Calendar, DollarSign, Users, Shield } from 'lucide-react';
import { MoveInOutSettings } from '@/lib/types';

export function MoveInOutSettingsModal() {
  const { 
    isMoveInOutSettingsModalOpen, 
    setMoveInOutSettingsModalOpen,
    moveInOutSettings,
    setMoveInOutSettings
  } = useAppStore();

  const [settings, setSettings] = useState<MoveInOutSettings>(moveInOutSettings);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newDuration, setNewDuration] = useState({ label: '', value: '' });
  const [newDock, setNewDock] = useState('');

  useEffect(() => {
    if (isMoveInOutSettingsModalOpen) {
      setSettings(moveInOutSettings);
    }
  }, [isMoveInOutSettingsModalOpen, moveInOutSettings]);

  const handleSave = () => {
    // Validation
    if (settings.depositAmount < 0) {
      toast.error('Deposit amount cannot be negative');
      return;
    }

    if (settings.timeSlots.length === 0) {
      toast.error('At least one time slot is required');
      return;
    }

    if (settings.durations.length === 0) {
      toast.error('At least one duration option is required');
      return;
    }

    if (settings.loadingDocks.length === 0) {
      toast.error('At least one loading dock is required');
      return;
    }

    if (settings.operatingHours.start >= settings.operatingHours.end) {
      toast.error('Opening time must be before closing time');
      return;
    }

    setMoveInOutSettings(settings);
    toast.success('Move In/Out settings updated successfully');
    setMoveInOutSettingsModalOpen(false);
  };

  const handleReset = () => {
    const defaultSettings: MoveInOutSettings = {
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
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.trim()) return;
    if (settings.timeSlots.includes(newTimeSlot)) {
      toast.error('This time slot already exists');
      return;
    }
    setSettings({
      ...settings,
      timeSlots: [...settings.timeSlots, newTimeSlot]
    });
    setNewTimeSlot('');
    toast.success('Time slot added');
  };

  const removeTimeSlot = (slot: string) => {
    setSettings({
      ...settings,
      timeSlots: settings.timeSlots.filter(s => s !== slot)
    });
    toast.success('Time slot removed');
  };

  const addDuration = () => {
    if (!newDuration.label.trim() || !newDuration.value.trim()) {
      toast.error('Please fill in both label and value');
      return;
    }
    setSettings({
      ...settings,
      durations: [...settings.durations, newDuration]
    });
    setNewDuration({ label: '', value: '' });
    toast.success('Duration added');
  };

  const removeDuration = (index: number) => {
    setSettings({
      ...settings,
      durations: settings.durations.filter((_, i) => i !== index)
    });
    toast.success('Duration removed');
  };

  const addDock = () => {
    if (!newDock.trim()) return;
    if (settings.loadingDocks.includes(newDock)) {
      toast.error('This dock already exists');
      return;
    }
    setSettings({
      ...settings,
      loadingDocks: [...settings.loadingDocks, newDock]
    });
    setNewDock('');
    toast.success('Loading dock added');
  };

  const removeDock = (dock: string) => {
    setSettings({
      ...settings,
      loadingDocks: settings.loadingDocks.filter(d => d !== dock)
    });
    toast.success('Loading dock removed');
  };

  return (
    <Dialog open={isMoveInOutSettingsModalOpen} onOpenChange={setMoveInOutSettingsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            📦 Move In/Out Configuration
          </DialogTitle>
          <p className="text-muted-foreground">
            Configure all settings for move in/out requests
          </p>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Security Deposit
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="depositAmount" className="text-amber-900 font-semibold">
                  Refundable Deposit Amount ($)
                </Label>
                <Input
                  id="depositAmount"
                  type="number"
                  min="0"
                  step="10"
                  value={settings.depositAmount}
                  onChange={(e) => setSettings({ ...settings, depositAmount: Number(e.target.value) })}
                  className="border-amber-300 text-lg"
                />
                <p className="text-sm text-amber-800">
                  This amount is refunded after the move if no damages occur
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Advance Booking Period</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="advanceBooking">Days in Advance</Label>
                <Input
                  id="advanceBooking"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.advanceBookingDays}
                  onChange={(e) => setSettings({ ...settings, advanceBookingDays: Number(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">
                  How far ahead residents can book move in/out requests
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Operating Hours</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.operatingHours.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, start: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.operatingHours.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, end: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Scheduling Settings */}
          <TabsContent value="scheduling" className="space-y-6">
            {/* Time Slots */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Available Time Slots
              </h4>
              
              <div className="space-y-2">
                {settings.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                    <span className="flex-1 font-medium">{slot}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTimeSlot(slot)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 08:00-10:00"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                />
                <Button onClick={addTimeSlot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <Separator />

            {/* Durations */}
            <div className="space-y-4">
              <h4 className="font-semibold">Duration Options</h4>
              
              <div className="space-y-2">
                {settings.durations.map((duration, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                    <span className="flex-1">
                      <strong>{duration.label}</strong> ({duration.value} hours)
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDuration(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Label (e.g., Half day)"
                  value={newDuration.label}
                  onChange={(e) => setNewDuration({ ...newDuration, label: e.target.value })}
                />
                <Input
                  placeholder="Hours (e.g., 4)"
                  type="number"
                  value={newDuration.value}
                  onChange={(e) => setNewDuration({ ...newDuration, value: e.target.value })}
                />
              </div>
              <Button onClick={addDuration} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Duration
              </Button>
            </div>
          </TabsContent>

          {/* Facilities Settings */}
          <TabsContent value="facilities" className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Loading Docks / Areas</h4>
              <p className="text-sm text-muted-foreground">
                Configure available loading areas for moves
              </p>
              
              <div className="space-y-2">
                {settings.loadingDocks.map((dock, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                    <span className="flex-1 font-medium">{dock}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDock(dock)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Dock D, East Entrance"
                  value={newDock}
                  onChange={(e) => setNewDock(e.target.value)}
                />
                <Button onClick={addDock}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Requirements Settings */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="space-y-6">
              {/* Insurance Requirement */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">Require Insurance Certificate</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Moving company must provide proof of insurance
                  </p>
                </div>
                <Switch
                  checked={settings.requireInsurance}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireInsurance: checked })}
                />
              </div>

              {/* Max Movers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Maximum Movers Allowed</h4>
                </div>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxMoversAllowed}
                  onChange={(e) => setSettings({ ...settings, maxMoversAllowed: Number(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of movers allowed per move request
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuration Summary */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h4 className="font-semibold text-sm">Configuration Summary</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>• Deposit: ${settings.depositAmount}</p>
            <p>• {settings.timeSlots.length} time slots available</p>
            <p>• {settings.durations.length} duration options</p>
            <p>• Operating: {settings.operatingHours.start} - {settings.operatingHours.end}</p>
            <p>• Book up to {settings.advanceBookingDays} days ahead</p>
            <p>• {settings.loadingDocks.length} loading docks</p>
            <p>• Insurance: {settings.requireInsurance ? 'Required' : 'Optional'}</p>
            <p>• Max movers: {settings.maxMoversAllowed}</p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMoveInOutSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              💾 Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
