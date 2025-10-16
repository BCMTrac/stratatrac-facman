'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { FacilityGroup } from './FacilityGroup';
import { Button } from '@/components/ui/button';
import { Settings, BarChart3, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export function FacilitiesSidebar() {
  const { facilities, currentUser } = useAppStore();
  const isAdmin = currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser';

  return (
    <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-6 h-fit shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-white">Facilities</h2>
      
      <div className="space-y-2">
        {Object.entries(facilities).map(([categoryId, category]) => (
          <FacilityGroup
            key={categoryId}
            icon={category.icon}
            name={category.name}
            facilities={category.facilities}
            isCustom={category.isCustom}
          />
        ))}
      </div>

      {/* Dashboard Link for All Users */}
      <div className="my-6 h-px bg-[#00D9FF]" />
      
      <Link href="/dashboard">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 border-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] text-white font-semibold" 
          size="sm"
        >
          <LayoutDashboard className="h-5 w-5" />
          My Dashboard
        </Button>
      </Link>

      {/* Admin Links */}
      {isAdmin && (
        <>
          <div className="my-6 h-px bg-[#00D9FF]" />
          
          <div className="space-y-3 bg-[#001F3F]/50 p-4 rounded-lg border border-[#00D9FF]/50">
            <p className="text-sm font-bold text-[#00D9FF] mb-3 uppercase tracking-wide">
              Administration
            </p>
            
            <Link href="/admin">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] text-white font-semibold" 
                size="sm"
              >
                <Settings className="h-5 w-5" />
                Settings & Configuration
              </Button>
            </Link>
            
            <Link href="/reports">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 border-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] text-white font-semibold" 
                size="sm"
              >
                <BarChart3 className="h-5 w-5" />
                Reports & Analytics
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
