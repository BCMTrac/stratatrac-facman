'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { BRANDING } from '@/lib/branding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { StrataTracLogo } from '@/components/branding/StrataTracLogo';
import Link from 'next/link';

const roleDescriptions = {
  bcmtrac: 'Super Administrator',
  miduser: 'Facility Administrator',
  standard: 'Standard User',
};

const avatarColors = {
  bcmtrac: 'bg-gradient-to-br from-blue-500 to-blue-700',
  miduser: 'bg-gradient-to-br from-blue-400 to-blue-600',
  standard: 'bg-gradient-to-br from-teal-400 to-teal-600',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, isTestingMode, setTestingMode } = useAppStore();

  const handleLogout = () => {
    logout();
    setTestingMode(false);
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <div className="bg-[#001F3F] border-b-2 border-[#00D9FF]/30 px-6 py-3 shadow-xl">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          {/* Logo - directly on dark background like login page */}
          <StrataTracLogo size="small" />
          <div>
            <p className="text-[#00D9FF] text-sm font-semibold">
              {BRANDING.tagline}
            </p>
            <p className="text-gray-400 text-xs">
              Facilities Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Bookings - Always available */}
          {pathname !== '/' && (
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <LayoutDashboard className="h-4 w-4" />
                Bookings
              </Button>
            </Link>
          )}
          
          {/* Dashboard - Admin/Mid only */}
          {(currentUser.role === 'bcmtrac' || currentUser.role === 'miduser') && pathname !== '/dashboard' && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
          
          {/* Reports - Admin/Mid only */}
          {(currentUser.role === 'bcmtrac' || currentUser.role === 'miduser') && pathname !== '/reports' && (
            <Link href="/reports">
              <Button variant="outline" size="sm" className="gap-2 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <LayoutDashboard className="h-4 w-4" />
                Reports
              </Button>
            </Link>
          )}
          
          {/* System Admin - Super Admin only */}
          {currentUser.role === 'bcmtrac' && pathname !== '/admin' && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] bg-[#001F3F] font-semibold">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
          
          <div className="flex items-center gap-3">
            {/* Testing Mode Badge */}
            {isTestingMode && (
              <Link href="/test">
                <Badge className="bg-purple-600 text-white px-4 py-2 text-sm font-bold cursor-pointer hover:bg-purple-700 transition-all animate-pulse">
                  🖖 TESTING MODE
                </Badge>
              </Link>
            )}
            
        <Avatar className={`h-11 w-11 ${avatarColors[currentUser.role]} border-2 border-[#00D9FF]`}>
        {currentUser.avatar && (
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        )}
          <AvatarFallback className="text-white font-bold text-base">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-white text-base">
                {currentUser.name}
              </div>
              <div className="text-sm text-[#00D9FF]">
                {roleDescriptions[currentUser.role]}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 bg-transparent border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#001F3F] font-semibold transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
