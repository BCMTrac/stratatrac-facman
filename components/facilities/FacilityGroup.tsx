'use client';

import { useState } from 'react';
import { FacilityItem } from './FacilityItem';
import { Facility } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FacilityGroupProps {
  icon: string;
  name: string;
  facilities: Facility[];
  isCustom: boolean;
}

export function FacilityGroup({ icon, name, facilities, isCustom }: FacilityGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const enabledFacilities = facilities.filter(f => f.enabled);

  if (enabledFacilities.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
          isCustom
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
            : 'bg-gradient-to-r from-muted to-muted/50 hover:from-muted/80 hover:to-muted/30'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className={`font-semibold ${isCustom ? 'text-white' : 'text-foreground'}`}>
            {name}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className={`h-5 w-5 ${isCustom ? 'text-white' : 'text-muted-foreground'}`} />
        ) : (
          <ChevronDown className={`h-5 w-5 ${isCustom ? 'text-white' : 'text-muted-foreground'}`} />
        )}
      </button>

      <div
        className={`space-y-2 mt-2 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {enabledFacilities.map((facility) => (
          <FacilityItem
            key={facility.id}
            icon={facility.icon}
            name={facility.name}
            enabled={facility.enabled}
          />
        ))}
      </div>
    </div>
  );
}