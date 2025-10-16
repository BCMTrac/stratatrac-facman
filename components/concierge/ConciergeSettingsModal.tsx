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
import { Bell, Clock, Users, Mail, MessageSquare } from 'lucide-react';

interface ConciergeSettings {
  // Package Notifications
  packageNotificationEmail: boolean;
  packageNotificationSMS: boolean;
  packageAutoNotify: boolean;
  packageNotifyDelay: number;
  packageRetentionDays: number;
  
  // Guest Registration
  guestRegistrationRequired: boolean;
  guestMaxDuration: number;
  guestAdvanceNotice: number;
  guestNotifyResident: boolean;
  guestPhotoRequired: boolean;
  
  // Service Hours
  serviceStartTime: string;
  serviceEndTime: string;
  weekendService: boolean;
  holidayService: boolean;
  
  // Auto Notifications
  autoNotifyArrival: boolean;
  autoNotifyDeparture: boolean;
  dailyDigest: boolean;
  dailyDigestTime: string;
}

const defaultSettings: ConciergeSettings = {
  packageNotificationEmail: true,
  packageNotificationSMS: true,
  packageAutoNotify: true,
  packageNotifyDelay: 5,
  packageRetentionDays: 14,
  
  guestRegistrationRequired: true,
  guestMaxDuration: 7,
  guestAdvanceNotice: 24,
  guestNotifyResident: true,
  guestPhotoRequired: false,
  
  serviceStartTime: '08:00',
  serviceEndTime: '20:00',
  weekendService: true,
  holidayService: false,
  
  autoNotifyArrival: true,
  autoNotifyDeparture: false,
  dailyDigest: true,
  dailyDigestTime: '18:00',
};

export function ConciergeSettingsModal() {
  const { isConciergeSettingsModalOpen, setConciergeSettingsModalOpen } = useAppStore();
  const [settings, setSettings] = useState<ConciergeSettings>(defaultSettings);

  const handleSave = () => {
    toast.success('Concierge settings saved successfully!');
    setConciergeSettingsModalOpen(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  return (
    <Dialog open={isConciergeSettingsModalOpen} onOpenChange={setConciergeSettingsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Concierge Services Settings
          </DialogTitle>
          <DialogDescription>
            Configure package notifications, guest registration, service hours, and automated notifications
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="hours">Service Hours</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Package Notifications Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                📦 Package Notification Settings
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email when package arrives
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.packageNotificationEmail}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, packageNotificationEmail: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send SMS when package arrives
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.packageNotificationSMS}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, packageNotificationSMS: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label className="font-medium">Auto-Notify on Arrival</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically notify resident when package logged
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.packageAutoNotify}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, packageAutoNotify: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Delay (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.packageNotifyDelay}
                    onChange={(e) =>
                      setSettings({ ...settings, packageNotifyDelay: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    max="60"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wait time before sending notification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Package Retention (days)</Label>
                  <Input
                    type="number"
                    value={settings.packageRetentionDays}
                    onChange={(e) =>
                      setSettings({ ...settings, packageRetentionDays: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                    max="90"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to hold packages before escalation
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  ℹ️ Package Notification Flow
                </h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Concierge logs package arrival</li>
                  <li>System waits {settings.packageNotifyDelay} minutes</li>
                  <li>Sends {settings.packageNotificationEmail && 'email'}{settings.packageNotificationEmail && settings.packageNotificationSMS && ' and '}{settings.packageNotificationSMS && 'SMS'} to resident</li>
                  <li>Package held for up to {settings.packageRetentionDays} days</li>
                  <li>Reminder sent after {Math.floor(settings.packageRetentionDays / 2)} days</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          {/* Guest Registration Tab */}
          <TabsContent value="guests" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                👥 Guest Registration Rules
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="font-medium">Guest Registration Required</Label>
                      <p className="text-sm text-muted-foreground">
                        All guests must be registered in advance
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.guestRegistrationRequired}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, guestRegistrationRequired: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="font-medium">Notify Resident on Guest Arrival</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert resident when guest checks in
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.guestNotifyResident}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, guestNotifyResident: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label className="font-medium">Photo ID Required</Label>
                      <p className="text-sm text-muted-foreground">
                        Require photo identification for guest registration
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.guestPhotoRequired}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, guestPhotoRequired: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Maximum Guest Duration (days)</Label>
                  <Input
                    type="number"
                    value={settings.guestMaxDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, guestMaxDuration: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                    max="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum stay without extension approval
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Advance Notice Required (hours)</Label>
                  <Input
                    type="number"
                    value={settings.guestAdvanceNotice}
                    onChange={(e) =>
                      setSettings({ ...settings, guestAdvanceNotice: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    max="168"
                  />
                  <p className="text-xs text-muted-foreground">
                    How far in advance guests must be registered
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  ✓ Current Guest Policy
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Registration: {settings.guestRegistrationRequired ? 'Required' : 'Optional'}</li>
                  <li>• Advance notice: {settings.guestAdvanceNotice} hours minimum</li>
                  <li>• Maximum stay: {settings.guestMaxDuration} days</li>
                  <li>• Photo ID: {settings.guestPhotoRequired ? 'Required' : 'Optional'}</li>
                  <li>• Resident notification: {settings.guestNotifyResident ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Service Hours Tab */}
          <TabsContent value="hours" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Concierge Service Hours
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Start Time</Label>
                  <Input
                    type="time"
                    value={settings.serviceStartTime}
                    onChange={(e) =>
                      setSettings({ ...settings, serviceStartTime: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Service End Time</Label>
                  <Input
                    type="time"
                    value={settings.serviceEndTime}
                    onChange={(e) =>
                      setSettings({ ...settings, serviceEndTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Weekend Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide concierge services on weekends
                    </p>
                  </div>
                  <Switch
                    checked={settings.weekendService}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, weekendService: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Holiday Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide concierge services on statutory holidays
                    </p>
                  </div>
                  <Switch
                    checked={settings.holidayService}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, holidayService: checked })
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">📅 Service Schedule</h4>
                <div className="text-sm space-y-2 text-muted-foreground">
                  <p><strong>Weekdays:</strong> {settings.serviceStartTime} - {settings.serviceEndTime}</p>
                  <p><strong>Weekends:</strong> {settings.weekendService ? `${settings.serviceStartTime} - ${settings.serviceEndTime}` : 'Closed'}</p>
                  <p><strong>Holidays:</strong> {settings.holidayService ? `${settings.serviceStartTime} - ${settings.serviceEndTime}` : 'Closed'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Auto-Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Automated Notifications
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="font-medium">Guest Arrival Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-notify residents when guests arrive
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoNotifyArrival}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoNotifyArrival: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label className="font-medium">Guest Departure Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-notify residents when guests depart
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoNotifyDeparture}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoNotifyDeparture: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="font-medium">Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Send daily summary of concierge activities
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, dailyDigest: checked })
                    }
                  />
                </div>
              </div>

              {settings.dailyDigest && (
                <div className="space-y-2">
                  <Label>Daily Digest Time</Label>
                  <Input
                    type="time"
                    value={settings.dailyDigestTime}
                    onChange={(e) =>
                      setSettings({ ...settings, dailyDigestTime: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Time to send daily activity summary
                  </p>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">✉️ Active Notifications</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {settings.autoNotifyArrival && <li>✓ Guest arrival alerts</li>}
                  {settings.autoNotifyDeparture && <li>✓ Guest departure alerts</li>}
                  {settings.dailyDigest && <li>✓ Daily digest at {settings.dailyDigestTime}</li>}
                  {settings.packageAutoNotify && <li>✓ Package arrival notifications</li>}
                  {!settings.autoNotifyArrival && !settings.autoNotifyDeparture && !settings.dailyDigest && !settings.packageAutoNotify && (
                    <li className="text-muted-foreground">No automatic notifications enabled</li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConciergeSettingsModalOpen(false)}>
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
