'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { BRANDING } from '@/lib/branding';
import { userProfiles } from '@/lib/data';
import { UserRole } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Shield, User } from 'lucide-react';
import { StrataTracLogo } from '@/components/branding/StrataTracLogo';
import Image from 'next/image';

const userTypeConfig = {
  bcmtrac: {
    icon: Crown,
    title: 'Super Administrator',
    description: 'Full system access',
    gradient: 'from-blue-500 to-blue-700',
  },
  miduser: {
    icon: Shield,
    title: 'Facility Administrator',
    description: 'Manage facilities & bookings',
    gradient: 'from-blue-400 to-blue-600',
  },
  standard: {
    icon: User,
    title: 'Owner / Tenant / Agent',
    description: 'Make and cancel own bookings',
    gradient: 'from-teal-400 to-teal-600',
  },
};

export function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setCurrentUser } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    const user = userProfiles[role];
    setCurrentUser(user);
    setLoginModalOpen(false);
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={() => {}}>
      {/* Full-screen background overlay */}
      {isLoginModalOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{
            backgroundImage: 'url("/images/building-pool-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
      )}

      <DialogContent 
        className="sm:max-w-[650px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-2 border-[#00D9FF] shadow-2xl z-50" 
        showCloseButton={false}
      >
        <DialogHeader className="text-center space-y-6">
          <DialogTitle className="sr-only">
            StrataTrac Login - Select Your Access Level
          </DialogTitle>
          
          {/* Logo - White Background */}
          <div className="flex justify-center pt-4">
            <StrataTracLogo size="large" />
          </div>
          
          {/* User Avatar */}
          <div className="flex justify-center -mt-2">
            <div className="relative">
              <Image
                src="/images/gary.jpg"
                alt="User Profile"
                width={100}
                height={100}
                className="rounded-full border-4 border-[#00D9FF] shadow-2xl object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[#00D9FF] text-lg font-semibold">
              Strata Management Solutions
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base font-medium">
              Facilities Management System
            </p>
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Select Your Access Level
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Choose the role that matches your permissions
            </p>
          </div>

          <div className="space-y-3">
            {(Object.keys(userTypeConfig) as UserRole[]).map((role) => {
              const config = userTypeConfig[role];
              const Icon = config.icon;
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  onDoubleClick={() => handleLogin(role)}
                  className={`
                    w-full p-5 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-lg shadow-[#00D9FF]/20 scale-[1.02]' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-[#00D9FF]/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-4 rounded-xl bg-gradient-to-br ${config.gradient} 
                      flex items-center justify-center shadow-lg
                    `}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-1">
                        {config.title}
                      </h4>
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedRole && (
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => handleLogin(selectedRole)}
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#0099CC] hover:from-[#00C5E6] hover:to-[#0086B3] text-white shadow-xl"
              >
                Continue as {userTypeConfig[selectedRole].title}
              </Button>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Double-click a role card or click Continue to proceed
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Powered by <span className="font-bold text-[#00D9FF] text-lg">{BRANDING.companyName}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {BRANDING.contact.website}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
