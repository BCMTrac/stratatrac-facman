'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings,
  FolderPlus,
  Truck,
  ArrowLeft,
  Building2,
  Bell,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ConfigureFacilitiesModal } from '@/components/facilities/ConfigureFacilitiesModal';
import { AddCategoryModal } from '@/components/facilities/AddCategoryModal';
import { MoveInOutSettingsModal } from '@/components/move-in-out/MoveInOutSettingsModal';
import { ConciergeSettingsModal } from '@/components/concierge/ConciergeSettingsModal';
import { BuildingSettingsModal } from '@/components/building/BuildingSettingsModal';
import { SystemSettingsModal } from '@/components/system/SystemSettingsModal';
import { WorkflowManagementModal } from '@/components/workflow/WorkflowManagementModal';

export default function AdminPage() {
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const { 
    currentUser,
    setConfigureFacilitiesModalOpen,
    setAddCategoryModalOpen,
    setMoveInOutSettingsModalOpen,
    setConciergeSettingsModalOpen,
    setBuildingSettingsModalOpen,
    setSystemSettingsModalOpen
  } = useAppStore();

  if (!currentUser || (currentUser.role !== 'bcmtrac' && currentUser.role !== 'miduser')) {
    return (
      <div className="min-h-screen bg-[#001F3F] relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")',
            zIndex: 0
          }}
        />
        
        <div className="relative z-10">
          <Header />
          <div className="max-w-[1400px] mx-auto p-6">
            <div className="text-center py-12 bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Access Denied</h2>
              <p className="text-gray-300">Administration features are only available to administrators.</p>
              <Link href="/">
                <Button className="mt-4 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] hover:from-[#00C5E6] hover:to-[#0086B3] text-white">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfigureFacilitiesModal />
      <AddCategoryModal />
      <MoveInOutSettingsModal />
      <ConciergeSettingsModal />
      <BuildingSettingsModal />
      <SystemSettingsModal />
      <WorkflowManagementModal isOpen={isWorkflowModalOpen} onClose={() => setIsWorkflowModalOpen(false)} />
      
      <div className="min-h-screen bg-[#001F3F] relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")',
            zIndex: 0
          }}
        />
        
        <div className="relative z-10">
          <Header />
        
        <div className="max-w-[1400px] mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6 bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 shadow-2xl">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="mb-4 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2 text-white">
              <Settings className="h-8 w-8 text-[#00D9FF]" />
              Administration & Settings
            </h1>
            <p className="text-gray-300">
              Manage facilities, configure settings, and customize the system
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Configure Facilities Card */}
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] hover:scale-[1.02]" onClick={() => setConfigureFacilitiesModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00D9FF]/20 rounded-lg">
                    <Settings className="h-6 w-6 text-[#00D9FF]" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Configure Facilities</CardTitle>
                    <CardDescription className="text-gray-300">Edit facilities & settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200 mb-4">
                  Manage existing facilities, enable/disable amenities, configure time settings, and update facility details.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-[#00D9FF] rounded-full"></span>
                    Enable/disable facilities
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-[#00D9FF] rounded-full"></span>
                    Configure time settings
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-[#00D9FF] rounded-full"></span>
                    Edit facility names
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-[#00D9FF] rounded-full"></span>
                    Delete facilities
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Add Category Card */}
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] hover:scale-[1.02]" onClick={() => setAddCategoryModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <FolderPlus className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Add Category</CardTitle>
                    <CardDescription className="text-gray-300">Create new categories</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200 mb-4">
                  Create custom facility categories to organize your amenities and services better.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full"></span>
                    Custom category names
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full"></span>
                    Choose custom icons
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full"></span>
                    Organize facilities
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full"></span>
                    Delete custom categories
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Move In/Out Settings Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setMoveInOutSettingsModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Move In/Out Settings</CardTitle>
                    <CardDescription>Configure move settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage comprehensive settings for move in and move out requests.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-orange-600 rounded-full"></span>
                    Deposit amounts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-orange-600 rounded-full"></span>
                    Time slots & durations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-orange-600 rounded-full"></span>
                    Loading dock management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-orange-600 rounded-full"></span>
                    Insurance & requirements
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Concierge Settings Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setConciergeSettingsModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Concierge Services</CardTitle>
                    <CardDescription>Configure settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure concierge service settings, notification preferences, and service hours.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                    Package notification settings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                    Guest registration rules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                    Service hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                    Auto-notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Building Management Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setBuildingSettingsModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Building Settings</CardTitle>
                    <CardDescription>Configure settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure building-wide settings, operating hours, and general policies.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-purple-600 rounded-full"></span>
                    Operating hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-purple-600 rounded-full"></span>
                    Holiday schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-purple-600 rounded-full"></span>
                    Maintenance windows
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-purple-600 rounded-full"></span>
                    Global policies
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* System Settings Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSystemSettingsModalOpen(true)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-500/10 rounded-lg">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure system-wide settings, user roles, and application preferences.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gray-600 rounded-full"></span>
                    User management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gray-600 rounded-full"></span>
                    Email templates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gray-600 rounded-full"></span>
                    Branding & theme
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gray-600 rounded-full"></span>
                    Backup & restore
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Workflow Management Card */}
            <Link href="/workflows">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <Workflow className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>Workflow Management</CardTitle>
                    <CardDescription>Configure workflows</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Design approval workflows, configure multi-stage approvals, and automate communications.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-cyan-600 rounded-full"></span>
                    Multi-level approvals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-cyan-600 rounded-full"></span>
                    Conditional logic
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-cyan-600 rounded-full"></span>
                    Auto-notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-cyan-600 rounded-full"></span>
                    Visual builder
                  </li>
                </ul>
              </CardContent>
            </Card>
              </Link>

          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {Object.values(useAppStore.getState().facilities).reduce((acc, cat) => acc + cat.facilities.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total Facilities</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {Object.values(useAppStore.getState().facilities).reduce((acc, cat) => acc + cat.facilities.filter(f => f.enabled).length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Active Facilities</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {Object.values(useAppStore.getState().facilities).filter(cat => cat.isCustom).length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Custom Categories</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
