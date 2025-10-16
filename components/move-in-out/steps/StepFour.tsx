'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store/useAppStore';

interface StepFourProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepFour({ data, updateData, errors }: StepFourProps) {
  const { moveInOutSettings } = useAppStore();
  
  const facilities = [
    { id: 'loadingDock', label: '🚛 Loading Dock', default: true },
    { id: 'serviceElevator', label: '🛗 Service Elevator', default: true },
    { id: 'visitorParking', label: '🅿️ Visitor Parking Bay', default: false },
    { id: 'movingTrolleys', label: '🛒 Moving Trolleys', default: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          🏢 Building Facilities Required
        </h3>

        {/* Facility Checkboxes */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:border-primary transition-colors"
            >
              <Checkbox
                id={facility.id}
                checked={data[facility.id] ?? facility.default}
                onCheckedChange={(checked) => updateData(facility.id, checked)}
              />
              <Label
                htmlFor={facility.id}
                className="cursor-pointer flex-1 font-medium"
              >
                {facility.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Loading Dock Selection */}
          <div className="space-y-2">
            <Label htmlFor="dockSelection">Loading Dock Selection *</Label>
            <Select
              value={data.dockSelection}
              onValueChange={(value) => updateData('dockSelection', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loading dock..." />
              </SelectTrigger>
              <SelectContent>
                {moveInOutSettings.loadingDocks.map((dock) => (
                  <SelectItem key={dock} value={dock}>
                    {dock}
                  </SelectItem>
                ))}
                <SelectItem value="any">Any Available</SelectItem>
              </SelectContent>
            </Select>
            {errors.dockSelection && (
              <p className="text-sm text-destructive">{errors.dockSelection}</p>
            )}
          </div>

          {/* Parking Bay Number */}
          <div className="space-y-2">
            <Label htmlFor="parkingBay">Parking Bay Number (if required)</Label>
            <Input
              id="parkingBay"
              value={data.parkingBay}
              onChange={(e) => updateData('parkingBay', e.target.value)}
              placeholder="e.g., V1, V2, V3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}