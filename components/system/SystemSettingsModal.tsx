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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Settings, Users, Mail, Palette, Database, Plus, Trash2 } from 'lucide-react';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
}

interface SystemSettings {
  // User Management
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  passwordMinLength: number;
  sessionTimeout: number;
  roles: UserRole[];
  
  // Email Templates
  emailTemplates: EmailTemplate[];
  fromEmail: string;
  fromName: string;
  smtpEnabled: boolean;
  
  // Branding
  buildingName: string;
  primaryColor: string;
  logoUrl: string;
  welcomeMessage: string;
  
  // Backup & Maintenance
  autoBackup: boolean;
  backupFrequency: string;
  retentionDays: number;
  maintenanceMode: boolean;
}

const defaultSettings: SystemSettings = {
  allowSelfRegistration: false,
  requireEmailVerification: true,
  passwordMinLength: 8,
  sessionTimeout: 30,
  roles: [
    { id: '1', name: 'Super Admin', permissions: ['all'] },
    { id: '2', name: 'Manager', permissions: ['read', 'write', 'configure'] },
    { id: '3', name: 'Resident', permissions: ['read', 'book'] },
  ],
  
  emailTemplates: [
    { 
      id: '1', 
      name: 'Booking Confirmation', 
      subject: 'Your Booking is Confirmed',
      body: 'Dear {{name}},\n\nYour booking for {{facility}} on {{date}} has been confirmed.\n\nThank you!',
      type: 'booking_created'
    },
  ],
  fromEmail: 'noreply@building.com',
  fromName: 'Building Management',
  smtpEnabled: false,
  
  buildingName: 'Residential Complex',
  primaryColor: '#0066cc',
  logoUrl: '',
  welcomeMessage: 'Welcome to our facilities management system',
  
  autoBackup: true,
  backupFrequency: 'daily',
  retentionDays: 30,
  maintenanceMode: false,
};

export function SystemSettingsModal() {
  const { isSystemSettingsModalOpen, setSystemSettingsModalOpen } = useAppStore();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleSave = () => {
    toast.success('System settings saved successfully!');
    setSystemSettingsModalOpen(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const addRole = () => {
    if (!newRoleName) {
      toast.error('Please enter role name');
      return;
    }
    
    const newRole: UserRole = {
      id: Date.now().toString(),
      name: newRoleName,
      permissions: ['read']
    };
    
    setSettings({
      ...settings,
      roles: [...settings.roles, newRole]
    });
    
    setNewRoleName('');
    toast.success('Role added');
  };

  const removeRole = (id: string) => {
    setSettings({
      ...settings,
      roles: settings.roles.filter(r => r.id !== id)
    });
    toast.success('Role removed');
  };

  const saveTemplate = () => {
    if (!editingTemplate) return;
    
    setSettings({
      ...settings,
      emailTemplates: settings.emailTemplates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      )
    });
    
    setEditingTemplate(null);
    toast.success('Template saved');
  };

  return (
    <Dialog open={isSystemSettingsModalOpen} onOpenChange={setSystemSettingsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6 text-gray-600" />
            System Settings
          </DialogTitle>
          <DialogDescription>
            Configure system-wide settings, user management, email templates, and branding
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Allow Self-Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow residents to register accounts themselves
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowSelfRegistration}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, allowSelfRegistration: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify email before access
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, requireEmailVerification: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 0 })
                    }
                    min="6"
                    max="32"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 0 })
                    }
                    min="5"
                    max="1440"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">User Roles</Label>
                
                {settings.roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Permissions: {role.permissions.join(', ')}
                      </p>
                    </div>
                    {role.id !== '1' && role.id !== '2' && role.id !== '3' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-base font-semibold">Add New Role</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Role name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                  <Button onClick={addRole} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMTP Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable email sending via SMTP
                    </p>
                  </div>
                  <Switch
                    checked={settings.smtpEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smtpEnabled: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      type="email"
                      value={settings.fromEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, fromEmail: e.target.value })
                      }
                      placeholder="noreply@building.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={settings.fromName}
                      onChange={(e) =>
                        setSettings({ ...settings, fromName: e.target.value })
                      }
                      placeholder="Building Management"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Email Templates</Label>
                
                {settings.emailTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-3">
                    {editingTemplate?.id === template.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editingTemplate.subject}
                          onChange={(e) =>
                            setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                          }
                          placeholder="Subject"
                        />
                        <Textarea
                          value={editingTemplate.body}
                          onChange={(e) =>
                            setEditingTemplate({ ...editingTemplate, body: e.target.value })
                          }
                          rows={6}
                          placeholder="Email body"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available variables: {`{{name}}, {{facility}}, {{date}}, {{time}}`}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveTemplate}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTemplate(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {template.body}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTemplate(template)}
                          >
                            Edit
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding & Theme
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Building Name</Label>
                  <Input
                    value={settings.buildingName}
                    onChange={(e) =>
                      setSettings({ ...settings, buildingName: e.target.value })
                    }
                    placeholder="Residential Complex"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, primaryColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) =>
                        setSettings({ ...settings, primaryColor: e.target.value })
                      }
                      placeholder="#0066cc"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={settings.logoUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, logoUrl: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to your building logo image
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Welcome Message</Label>
                  <Textarea
                    value={settings.welcomeMessage}
                    onChange={(e) =>
                      setSettings({ ...settings, welcomeMessage: e.target.value })
                    }
                    rows={3}
                    placeholder="Welcome message for users"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">🎨 Preview</h4>
                  <div className="space-y-2">
                    <div 
                      className="h-20 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      {settings.buildingName}
                    </div>
                    <p className="text-sm text-muted-foreground">{settings.welcomeMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Backup & Maintenance Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Restore
              </h3>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automatic database backups
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoBackup: checked })
                    }
                  />
                </div>

                {settings.autoBackup && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select
                        value={settings.backupFrequency}
                        onValueChange={(value) =>
                          setSettings({ ...settings, backupFrequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Retention Period (days)</Label>
                      <Input
                        type="number"
                        value={settings.retentionDays}
                        onChange={(e) =>
                          setSettings({ ...settings, retentionDays: parseInt(e.target.value) || 0 })
                        }
                        min="1"
                        max="365"
                      />
                      <p className="text-xs text-muted-foreground">
                        How long to keep backups before deletion
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium text-red-600">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable system for maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, maintenanceMode: checked })
                    }
                  />
                </div>
                {settings.maintenanceMode && (
                  <p className="text-sm text-red-600">
                    ⚠️ System will be inaccessible to users when maintenance mode is enabled
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSystemSettingsModalOpen(false)}>
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
