'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, FolderPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

export function ManageFacilitiesPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    setConfigureFacilitiesModalOpen,
    setAddCategoryModalOpen,
    setMoveInOutSettingsModalOpen,
  } = useAppStore();

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="gap-2 w-full sm:w-auto"
        >
          <Settings className="h-4 w-4" />
          📋 Manage Facilities
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => setConfigureFacilitiesModalOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure
            </Button>
            <Button
              onClick={() => setAddCategoryModalOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Add Category
            </Button>
            <Button
              onClick={() => setMoveInOutSettingsModalOpen(true)}
              variant="outline"
              className="gap-2"
            >
              📦 Move In/Out Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}