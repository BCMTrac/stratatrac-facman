'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, Clock, Calendar, Wrench, Plus, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
  recurring: boolean;
}

interface MaintenanceWindow {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  affectedAreas: string;
}

interface BuildingSettings {
  buildingOpenTime: string;
  buildingCloseTime: string;
  weekendAccess: boolean;
  afterHoursAccess: boolean;
  
  holidays: Holiday[];
  closedOnHolidays: boolean;
  holidayNotificationDays: number;
  
  maintenanceWindows: MaintenanceWindow[];
  autoNotifyMaintenance: boolean;
  maintenanceNotificationDays: number;
  
  quietHoursStart: string;
  quietHoursEnd: string;
  maxBookingsPerResident: number;
  advanceBookingDays: number;
  cancellationHours: number;
}

const defaultSettings: BuildingSettings = {
  buildingOpenTime: '06:00',
  buildingCloseTime: '23:00',
  weekendAccess: true,
  afterHoursAccess: false,
  
  holidays: [
    { id: '1', name: 'New Year\'s Day', date: '2025-01-01', recurring: true },
    { id: '2', name: 'Christmas Day', date: '2025-12-25', recurring: true },
  ],
  closedOnHolidays: true,
  holidayNotificationDays: 7,
  
  maintenanceWindows: [],
  autoNotifyMaintenance: true,
  maintenanceNotificationDays: 3,
  
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  maxBookingsPerResident: 5,
  advanceBookingDays: 30,
  cancellationHours: 24,
};

export function BuildingSettingsModal() {
  const { isBuildingSettingsModalOpen, setBuildingSettingsModalOpen } = useAppStore();
  const [settings, setSettings] = useState<BuildingSettings>(defaultSettings);
  
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayRecurring, setNewHolidayRecurring] = useState(true);
  
  const [newMaintenanceTitle, setNewMaintenanceTitle] = useState('');
  const [newMaintenanceStart, setNewMaintenanceStart] = useState('');
  const [newMaintenanceEnd, setNewMaintenanceEnd] = useState('');
  const [newMaintenanceAreas, setNewMaintenanceAreas] = useState('');

  const handleSave = () => {
    toast.success('Building settings saved successfully!');
    setBuildingSettingsModalOpen(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const addHoliday = () => {
    if (!newHolidayName || !newHolidayDate) {
      toast.error('Please enter holiday name and date');
      return;
    }
    
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      name: newHolidayName,
      date: newHolidayDate,
      recurring: newHolidayRecurring
    };
    
    setSettings({
      ...settings,
      holidays: [...settings.holidays, newHoliday]
    });
    
    setNewHolidayName('');
    setNewHolidayDate('');
    toast.success('Holiday added');
  };

  const removeHoliday = (id: string) => {
    setSettings({
      ...settings,
      holidays: settings.holidays.filter(h => h.id !== id)
    });
    toast.success('Holiday removed');
  };

  const addMaintenanceWindow = () => {
    if (!newMaintenanceTitle || !newMaintenanceStart || !newMaintenanceEnd) {
      toast.error('Please fill in all maintenance window fields');
      return;
    }
    
    const newWindow: MaintenanceWindow = {
      id: Date.now().toString(),
      title: newMaintenanceTitle,
      startDate: newMaintenanceStart,
      endDate: newMaintenanceEnd,
      affectedAreas: newMaintenanceAreas
    };
    
    setSettings({
      ...settings,
      maintenanceWindows: [...settings.maintenanceWindows, newWindow]
    });
    
    setNewMaintenanceTitle('');
    setNewMaintenanceStart('');
    setNewMaintenanceEnd('');
    setNewMaintenanceAreas('');
    toast.success('Maintenance window added');
  };

  const removeMaintenanceWindow = (id: string) => {
    setSettings({
      ...settings,
      maintenanceWindows: settings.maintenanceWindows.filter(w => w.id !== id)
    });
    toast.success('Maintenance window removed');
  };

  return (
    <Dialog open={isBuildingSettingsModalOpen} onOpenChange={setBuildingSettingsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-purple-600" />
            Building Settings
          </DialogTitle>
          <DialogDescription>
            Configure building-wide settings, operating hours, holidays, and maintenance schedules
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hours">Operating Hours</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="policies">Global Policies</TabsTrigger>
          </TabsList>

          {/* Operating Hours Tab */}
          <TabsContent value="hours" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Building Operating Hours
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Building Opens</Label>
                  <Input
                    type="time"
                    value={settings.buildingOpenTime}
                    onChange={(e) =>
                      setSettings({ ...settings, buildingOpenTime: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Building Closes</Label>
                  <Input
                    type="time"
                    value={settings.buildingCloseTime}
                    onChange={(e) =>
                      setSettings({ ...settings, buildingCloseTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Weekend Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow facility access on weekends
                    </p>
                  </div>
                  <Switch
                    checked={settings.weekendAccess}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, weekendAccess: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">After-Hours Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow facility bookings outside operating hours
                    </p>
                  </div>
                  <Switch
                    checked={settings.afterHoursAccess}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, afterHoursAccess: checked })
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">🏢 Access Schedule</h4>
                <div className="text-sm space-y-2 text-muted-foreground">
                  <p><strong>Weekdays:</strong> {settings.buildingOpenTime} - {settings.buildingCloseTime}</p>
                  <p><strong>Weekends:</strong> {settings.weekendAccess ? `${settings.buildingOpenTime} - ${settings.buildingCloseTime}` : 'No Access'}</p>
                  <p><strong>After Hours:</strong> {settings.afterHoursAccess ? 'Allowed with restrictions' : 'Not Allowed'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Holidays Tab */}
          <TabsContent value="holidays" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Holiday Schedules
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Close on Holidays</Label>
                    <p className="text-sm text-muted-foreground">
                      Close building on designated holidays
                    </p>
                  </div>
                  <Switch
                    checked={settings.closedOnHolidays}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, closedOnHolidays: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Holiday Notification (days in advance)</Label>
                  <Input
                    type="number"
                    value={settings.holidayNotificationDays}
                    onChange={(e) =>
                      setSettings({ ...settings, holidayNotificationDays: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                    max="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Notify residents about upcoming holiday closures
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Defined Holidays</Label>
                
                {settings.holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString()} 
                        {holiday.recurring && ' • Recurring yearly'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHoliday(holiday.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-base font-semibold">Add New Holiday</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Holiday name"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newHolidayRecurring}
                      onCheckedChange={setNewHolidayRecurring}
                    />
                    <Label>Recurring yearly</Label>
                  </div>
                  <Button onClick={addHoliday} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Windows
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-Notify Residents</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically notify about scheduled maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoNotifyMaintenance}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoNotifyMaintenance: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Notification Period (days in advance)</Label>
                  <Input
                    type="number"
                    value={settings.maintenanceNotificationDays}
                    onChange={(e) =>
                      setSettings({ ...settings, maintenanceNotificationDays: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                    max="30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Scheduled Maintenance</Label>
                
                {settings.maintenanceWindows.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No maintenance windows scheduled
                  </p>
                ) : (
                  settings.maintenanceWindows.map((window) => (
                    <div key={window.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{window.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(window.startDate).toLocaleDateString()} - {new Date(window.endDate).toLocaleDateString()}
                        </p>
                        {window.affectedAreas && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Affected: {window.affectedAreas}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaintenanceWindow(window.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-base font-semibold">Schedule New Maintenance</Label>
                <Input
                  placeholder="Maintenance title"
                  value={newMaintenanceTitle}
                  onChange={(e) => setNewMaintenanceTitle(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Start Date</Label>
                    <Input
                      type="date"
                      value={newMaintenanceStart}
                      onChange={(e) => setNewMaintenanceStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">End Date</Label>
                    <Input
                      type="date"
                      value={newMaintenanceEnd}
                      onChange={(e) => setNewMaintenanceEnd(e.target.value)}
                    />
                  </div>
                </div>
                <Input
                  placeholder="Affected areas (optional)"
                  value={newMaintenanceAreas}
                  onChange={(e) => setNewMaintenanceAreas(e.target.value)}
                />
                <Button onClick={addMaintenanceWindow} size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Global Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                📋 Global Policies
              </h3>

              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <Label className="text-base font-semibold">Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) =>
                          setSettings({ ...settings, quietHoursStart: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) =>
                          setSettings({ ...settings, quietHoursEnd: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reduced noise policy enforced during these hours
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <Label className="text-base font-semibold">Booking Limits</Label>
                  
                  <div className="space-y-2">
                    <Label>Max Bookings per Resident</Label>
                    <Input
                      type="number"
                      value={settings.maxBookingsPerResident}
                      onChange={(e) =>
                        setSettings({ ...settings, maxBookingsPerResident: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      max="20"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum concurrent bookings allowed per resident
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Advance Booking Period (days)</Label>
                    <Input
                      type="number"
                      value={settings.advanceBookingDays}
                      onChange={(e) =>
                        setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      max="365"
                    />
                    <p className="text-xs text-muted-foreground">
                      How far in advance bookings can be made
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cancellation Notice (hours)</Label>
                    <Input
                      type="number"
                      value={settings.cancellationHours}
                      onChange={(e) =>
                        setSettings({ ...settings, cancellationHours: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      max="168"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum notice required to cancel bookings
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">✓ Policy Summary</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Quiet hours: {settings.quietHoursStart} - {settings.quietHoursEnd}</li>
                    <li>• Max bookings: {settings.maxBookingsPerResident} per resident</li>
                    <li>• Book ahead: {settings.advanceBookingDays} days maximum</li>
                    <li>• Cancel by: {settings.cancellationHours} hours before</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBuildingSettingsModalOpen(false)}>
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
