'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { LoginModal } from '@/components/auth/LoginModal';
import { Header } from '@/components/layout/Header';
import { FacilitiesSidebar } from '@/components/facilities/FacilitiesSidebar';
import { ConfigureFacilitiesModal } from '@/components/facilities/ConfigureFacilitiesModal';
import { AddCategoryModal } from '@/components/facilities/AddCategoryModal';
import { BookingsList } from '@/components/bookings/BookingsList';
import { BookingFormModal } from '@/components/bookings/BookingFormModal';
import { MoveInOutWizard } from '@/components/move-in-out/MoveInOutWizard';
import { MoveInOutSettingsModal } from '@/components/move-in-out/MoveInOutSettingsModal';
import { NotificationsSidebar } from '@/components/notifications/NotificationsSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const { 
    currentUser, 
    selectedFacility, 
    setBookingModalOpen,
    setMoveInOutModalOpen,
  } = useAppStore();

  // Redirect admins to dashboard on login
  useEffect(() => {
    if (currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Don't render bookings page if admin is being redirected
  if (currentUser?.role === 'bcmtrac' || currentUser?.role === 'miduser') {
    return null;
  }

  const handleMakeBooking = () => {
    if (!selectedFacility) {
      toast.warning('Please select a facility first');
      return;
    }

    if (selectedFacility === 'Move In / Move Out Request') {
      setMoveInOutModalOpen(true);
    } else {
      setBookingModalOpen(true);
    }
  };

  return (
    <>
      <LoginModal />
      <BookingFormModal />
      <MoveInOutWizard />
      <MoveInOutSettingsModal />
      <ConfigureFacilitiesModal />
      <AddCategoryModal />
      <NotificationsSidebar />
      
      {currentUser && (
        <div className="min-h-screen bg-[#001F3F] relative">
          {/* Background Image Overlay */}
          <div 
            className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")',
              zIndex: 0
            }}
          />
          
          <div className="relative z-10">
            <Header />
          
          <div className="w-full mx-auto p-4">
            <div className="grid grid-cols-[350px_1fr] gap-6">
              <FacilitiesSidebar />

              <div className="space-y-6">
                <div className="bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 rounded-xl p-8 text-center shadow-2xl">
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {selectedFacility || 'Select a Facility'}
                  </h2>
                  <p className="text-gray-200 mb-6">
                    {selectedFacility
                      ? selectedFacility === 'Move In / Move Out Request'
                        ? `${selectedFacility} selected! Click "Make Booking" to open the comprehensive move request form.`
                        : `${selectedFacility} selected! Click "Make Booking" to proceed.`
                      : 'Choose a facility from the sidebar menu to get started'}
                  </p>
                  <Button
                    onClick={handleMakeBooking}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0099CC] hover:from-[#00C5E6] hover:to-[#0086B3] text-[#001F3F] font-bold shadow-xl text-lg"
                  >
                    📅 Make Booking
                  </Button>
                </div>

                <BookingsList />
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}