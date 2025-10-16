'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StepTwoProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepTwo({ data, updateData, errors }: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          👤 Resident Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="residentName">Full Name *</Label>
            <Input
              id="residentName"
              value={data.residentName}
              onChange={(e) => updateData('residentName', e.target.value)}
              placeholder="John Doe"
            />
            {errors.residentName && (
              <p className="text-sm text-destructive">{errors.residentName}</p>
            )}
          </div>

          {/* Unit Number */}
          <div className="space-y-2">
            <Label htmlFor="residentUnit">Unit/Apartment Number *</Label>
            <Input
              id="residentUnit"
              value={data.residentUnit}
              onChange={(e) => updateData('residentUnit', e.target.value)}
              placeholder="A101"
            />
            {errors.residentUnit && (
              <p className="text-sm text-destructive">{errors.residentUnit}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="residentEmail">Email Address *</Label>
            <Input
              id="residentEmail"
              type="email"
              value={data.residentEmail}
              onChange={(e) => updateData('residentEmail', e.target.value)}
              placeholder="john.doe@example.com"
            />
            {errors.residentEmail && (
              <p className="text-sm text-destructive">{errors.residentEmail}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="residentPhone">Mobile Phone *</Label>
            <Input
              id="residentPhone"
              type="tel"
              value={data.residentPhone}
              onChange={(e) => updateData('residentPhone', e.target.value)}
              placeholder="+27 123 456 789"
            />
            {errors.residentPhone && (
              <p className="text-sm text-destructive">{errors.residentPhone}</p>
            )}
          </div>

          {/* Emergency Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
            <Input
              id="emergencyContact"
              value={data.emergencyContact}
              onChange={(e) => updateData('emergencyContact', e.target.value)}
              placeholder="Jane Doe"
            />
            {errors.emergencyContact && (
              <p className="text-sm text-destructive">{errors.emergencyContact}</p>
            )}
          </div>

          {/* Emergency Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={data.emergencyPhone}
              onChange={(e) => updateData('emergencyPhone', e.target.value)}
              placeholder="+27 987 654 321"
            />
            {errors.emergencyPhone && (
              <p className="text-sm text-destructive">{errors.emergencyPhone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}