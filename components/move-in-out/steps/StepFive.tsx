'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface StepFiveProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepFive({ data, updateData, errors }: StepFiveProps) {
  const specialItems = [
    { id: 'itemPiano', label: '🎹 Piano' },
    { id: 'itemFurniture', label: '🛋️ Large Furniture' },
    { id: 'itemFragile', label: '🖼️ Fragile/Artwork' },
    { id: 'itemAppliances', label: '🔌 Appliances' },
    { id: 'itemOffice', label: '💼 Office Equipment' },
    { id: 'itemVehicle', label: '🏍️ Vehicle/Motorcycle' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          📦 Special Items & Requirements
        </h3>

        <Label className="mb-3 block">Select items requiring special handling:</Label>

        {/* Special Items Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {specialItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:border-primary transition-colors"
            >
              <Checkbox
                id={item.id}
                checked={data[item.id] ?? false}
                onCheckedChange={(checked) => updateData(item.id, checked)}
              />
              <Label
                htmlFor={item.id}
                className="cursor-pointer flex-1 font-medium"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Special Notes */}
        <div className="space-y-2 mt-4">
          <Label htmlFor="specialNotes">Additional Requirements or Notes</Label>
          <Textarea
            id="specialNotes"
            rows={4}
            value={data.specialNotes}
            onChange={(e) => updateData('specialNotes', e.target.value)}
            placeholder="Any special access requirements, large items, or other details we should know..."
          />
        </div>
      </div>
    </div>
  );
}