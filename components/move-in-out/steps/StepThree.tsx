'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StepThreeProps {
  data: any;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function StepThree({ data, updateData, errors }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          🚛 Moving Company Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Moving Company Name *</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => updateData('companyName', e.target.value)}
              placeholder="ABC Movers"
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="companyContact">Company Contact Person *</Label>
            <Input
              id="companyContact"
              value={data.companyContact}
              onChange={(e) => updateData('companyContact', e.target.value)}
              placeholder="Mike Smith"
            />
            {errors.companyContact && (
              <p className="text-sm text-destructive">{errors.companyContact}</p>
            )}
          </div>

          {/* Company Phone */}
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Company Phone *</Label>
            <Input
              id="companyPhone"
              type="tel"
              value={data.companyPhone}
              onChange={(e) => updateData('companyPhone', e.target.value)}
              placeholder="+27 111 222 333"
            />
            {errors.companyPhone && (
              <p className="text-sm text-destructive">{errors.companyPhone}</p>
            )}
          </div>

          {/* Vehicle Registration */}
          <div className="space-y-2">
            <Label htmlFor="vehicleRego">Vehicle Registration *</Label>
            <Input
              id="vehicleRego"
              value={data.vehicleRego}
              onChange={(e) => updateData('vehicleRego', e.target.value)}
              placeholder="CA 123-456"
            />
            {errors.vehicleRego && (
              <p className="text-sm text-destructive">{errors.vehicleRego}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select
              value={data.vehicleType}
              onValueChange={(value) => updateData('vehicleType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small-van">Small Van</SelectItem>
                <SelectItem value="large-truck">Large Truck</SelectItem>
                <SelectItem value="semi-trailer">Semi-Trailer</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleType && (
              <p className="text-sm text-destructive">{errors.vehicleType}</p>
            )}
          </div>

          {/* Number of Movers */}
          <div className="space-y-2">
            <Label htmlFor="numMovers">Number of Movers *</Label>
            <Input
              id="numMovers"
              type="number"
              min="1"
              max="10"
              value={data.numMovers}
              onChange={(e) => updateData('numMovers', e.target.value)}
              placeholder="2"
            />
            {errors.numMovers && (
              <p className="text-sm text-destructive">{errors.numMovers}</p>
            )}
          </div>
        </div>

        {/* Insurance Certificate */}
        <div className="mt-4 space-y-2">
          <Label>Insurance Certificate (Required - $10M+ Public Liability) *</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-card">
            <p className="text-sm text-muted-foreground">
              📄 Click to upload insurance certificate
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              PDF, JPG, or PNG (Max 5MB)
            </p>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => updateData('insuranceFile', e.target.files?.[0])}
            />
          </div>
          {errors.insuranceFile && (
            <p className="text-sm text-destructive">{errors.insuranceFile}</p>
          )}
        </div>
      </div>
    </div>
  );
}