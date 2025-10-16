'use client';

import { useAppStore } from '@/lib/store/useAppStore';

interface FacilityItemProps {
  icon: string;
  name: string;
  enabled: boolean;
}

export function FacilityItem({ icon, name, enabled }: FacilityItemProps) {
  const { selectedFacility, setSelectedFacility } = useAppStore();
  const isSelected = selectedFacility === name;

  if (!enabled) return null;

  return (
    <button
      onClick={() => setSelectedFacility(name)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
        isSelected
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted/50 hover:bg-muted text-foreground hover:shadow-sm hover:-translate-y-0.5'
      }`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="font-medium text-sm">{name}</span>
    </button>
  );
}