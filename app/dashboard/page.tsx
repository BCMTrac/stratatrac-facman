'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Header } from '@/components/layout/Header';
import { NotificationsSidebar } from '@/components/notifications/NotificationsSidebar';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { ResidentDashboard } from '@/components/dashboard/ResidentDashboard';
import { AnimatedDashboard } from '@/components/dashboard/AnimatedDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return null;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'bcmtrac':
        return <AdminDashboard />;
      case 'miduser':
        return <ManagerDashboard />;
      case 'standard':
        return <ResidentDashboard />;
      default:
        return <ResidentDashboard />;
    }
  };

  return (
    <>
      <NotificationsSidebar />
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
        
        {/* Animated Request Dashboard */}
        <div className="p-6">
          <AnimatedDashboard />
        </div>

        {/* Divider */}
        <div className="mx-6 my-8 border-t border-[#00D9FF]/20" />

        {/* Original Dashboard */}
        <div className="px-6 pb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Facility Management</h2>
          {renderDashboard()}
        </div>
      </div>
    </div>
    </>
  );
}
